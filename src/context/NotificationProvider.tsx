// import { connectWS } from "@/services/soket";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import getNotificationAction from "@/actions/notification/getNotification.action";
import getAllPostAction from "@/actions/post/getAllPost.action";
import getCurrentUserAction from "@/actions/user/getCurrentUser.action";
import { urlWebSocketNotification } from "@/config/soket";
import { IRootState } from "@/models";

type ContextPropsType = {
  clientRef: any;
  isNotTwitter: boolean;
  IUnderstandthiswebsiteIsNotTwitter: () => void;
  setStateIsNotTwitter: () => void;
};

export const notificationType = {
  addPost: "Add_Post",
  deletePost: "Delete Post",
  likePost: "Like_Post",
  addComment: "Add_Comment",
  deleteComment: "Delete Comment",
  likeComment: "Like_Comment",
  following: "following",
  sendMessage: "Send_Message",
};

const NotificationContext = React.createContext<ContextPropsType | null>(null);

const NotificationProvider = ({ children }: React.PropsWithChildren) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: IRootState) => state.authReducer.isAuthenticated);

  const clientRef = React.useRef<any>(null);
  const retryDelayRef = React.useRef(5000);
  const [waitingToReconnect, setWaitingToReconnect] = React.useState<boolean | null>(null);
  // eslint-disable-next-line
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isNotTwitter, setIsNotTwitter] = React.useState<boolean>(true);

  const IUnderstandthiswebsiteIsNotTwitter = () => {
    localStorage.setItem("thiswebsiteIsNotTwitter", "I understand");
    setIsNotTwitter(true);
  };

  const setStateIsNotTwitter = () => setIsNotTwitter(false);

  React.useEffect(() => {
    if (localStorage.getItem("thiswebsiteIsNotTwitter")) {
      const thiswebsiteIsNotTwitter = localStorage.getItem("thiswebsiteIsNotTwitter");

      if (thiswebsiteIsNotTwitter === "I understand") {
        setIsNotTwitter(true);
      } else {
        setIsNotTwitter(false);
      }
    } else {
      setIsNotTwitter(false);
    }
  }, [isNotTwitter]);

  React.useEffect(() => {
    if (!isAuthenticated || waitingToReconnect || !urlWebSocketNotification) return;

    const token = localStorage.getItem("access");
    if (!token || clientRef.current) return;

    const client = new WebSocket(
      `${urlWebSocketNotification}?token=${encodeURIComponent(token)}`
    );
    clientRef.current = client;

    client.onerror = () => client.close();
    client.onopen = () => {
      retryDelayRef.current = 5000;
      setIsOpen(true);
    };
    client.onclose = (event) => {
      if (clientRef.current !== client) return;
      clientRef.current = null;
      setIsOpen(false);
      // A rejected/expired token should not create an endless retry loop.
      if (event.code === 4401) return;
      const retryDelay = retryDelayRef.current;
      retryDelayRef.current = Math.min(retryDelay * 2, 60000);
      setWaitingToReconnect(true);
      window.setTimeout(() => setWaitingToReconnect(null), retryDelay);
    };
    client.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "other_notifications") {
          switch (data.message) {
            case notificationType.addPost:
            case notificationType.likePost:
            case notificationType.deletePost:
            case notificationType.addComment:
            case notificationType.deleteComment:
              dispatch(getAllPostAction() as any);
              break;
            case notificationType.following:
              dispatch(getCurrentUserAction() as any);
              break;
            default:
              break;
          }
          dispatch(getNotificationAction() as any);
        }
      } catch {
        // Ignore malformed WebSocket messages and keep the connection alive.
      }
    };

    return () => {
      if (clientRef.current === client) {
        clientRef.current = null;
        client.close();
      }
    };
  }, [waitingToReconnect, isAuthenticated, dispatch]);

  return (
    <NotificationContext.Provider
      value={{ clientRef, isNotTwitter, IUnderstandthiswebsiteIsNotTwitter, setStateIsNotTwitter }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): ContextPropsType | null => {
  return React.useContext(NotificationContext);
};

export default NotificationProvider;

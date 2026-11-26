import React from "react";
import { useLocation } from "react-router-dom";

import ModalAuth from "@/components/auth/ModalAuth";
import Axios from "@/config/axios";
import * as Api from "@/config/apiEndPoint";
import { authRoutes } from "@/routes/auth.routes";

const SignUpConfirm: React.FC = () => {
  const { state } = useLocation();
  const email = typeof state === "string" ? state : "";
  const [emailInput, setEmailInput] = React.useState(email);
  const [resendStatus, setResendStatus] = React.useState("");
  const [resending, setResending] = React.useState(false);

  React.useEffect(() => {
    document.title = authRoutes.signupConfirm.title;
  }, []);

  const resendActivation = async () => {
    const recipient = emailInput.trim();
    if (!recipient || resending) return;
    setResending(true);
    setResendStatus("");
    try {
      await Axios.post(Api.resendActivationEndpoint, { email: recipient });
      setResendStatus("If this account is awaiting verification, a new activation email is ready. For local development, check the backend terminal for the activation link.");
    } catch {
      setResendStatus("Could not resend the activation email. Check that the backend is running and review its logs.");
    } finally {
      setResending(false);
    }
  };

  return (
    <ModalAuth>
      <div className="info-auth">
        <img src="/static/svg/envelope.svg" alt="envelope" />
        <h3>Thank you for signing up for a Twitter account.</h3>
        <br />
        <p>Please verify your email address to access your Twitter account.</p>
        <p>
          An activation email was requested for <strong>{email || "your email address"}</strong>. Check your inbox and spam folder. If you are running locally without SMTP credentials, the activation email appears in the backend terminal instead.
        </p>
        {!email && (
          <input
            type="email"
            aria-label="Email address for activation"
            placeholder="Email address"
            value={emailInput}
            onChange={(event) => setEmailInput(event.target.value)}
          />
        )}
        <button className="btn-login" type="button" onClick={resendActivation} disabled={resending || !emailInput.trim()}>
          {resending ? "Sending..." : "Resend activation email"}
        </button>
        {resendStatus && <p role="status">{resendStatus}</p>}
      </div>
    </ModalAuth>
  );
};

export default SignUpConfirm;

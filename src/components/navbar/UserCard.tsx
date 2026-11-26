import React from "react";
import ProfileImage from "@/components/ProfileImage";

import { IUserProfile } from "@/models";
// import { baseURL } from "@/config/axios";

type propsTypes = React.PropsWithChildren<{
  nameClass?: string;
  currentUser?: IUserProfile | null;
}>;

const UserCard: React.FC<propsTypes> = ({ children, nameClass, currentUser }) => {
  return (
    <div className={nameClass ? `UserCard ${nameClass}` : "UserCard"}>
      <div className="img-and-name">
        <ProfileImage src={currentUser?.profilePicture} alt="" />
        <div className="username">
          <strong>
            {currentUser?.user.first_name} {currentUser?.user.last_name}
          </strong>
          <p>@{currentUser?.pseudo}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default UserCard;

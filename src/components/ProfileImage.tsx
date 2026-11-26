import React from "react";
import { baseURL } from "@/config/axios";

const FALLBACK_AVATAR = "/static/svg/twitter-blue.svg";

type ProfileImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
};

const resolveSource = (src?: string | null) => {
  const value = src?.trim();
  if (!value) return FALLBACK_AVATAR;
  if (/^(https?:|data:|blob:|\/\/)/i.test(value)) return value;

  const apiBase = (baseURL || "").replace(/\/+$/, "");
  return apiBase ? `${apiBase}/${value.replace(/^\/+/, "")}` : `/${value.replace(/^\/+/, "")}`;
};

const ProfileImage: React.FC<ProfileImageProps> = ({ src, alt = "", onError, ...props }) => {
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => setFailed(false), [src]);

  return (
    <img
      {...props}
      alt={alt}
      src={failed ? FALLBACK_AVATAR : resolveSource(src)}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
};

export default ProfileImage;

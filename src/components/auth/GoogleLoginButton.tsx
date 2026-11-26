import ButtonCustom from "@/widgets/ButtonCustom";

interface propsTypes {
  text: string;
  nameClass?: string;
  isDisabled?: boolean;
}

export const GoogleLoginButton: React.FC<propsTypes> = ({ text, nameClass, isDisabled }) => {
  const handleReachGoogle = () => {
    const GoogleClientID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const GoogleCallBackURI = process.env.REACT_APP_GOOGLE_CALLBACK_URL;
    if (!GoogleClientID || !GoogleCallBackURI) {
      window.alert("O login do Google não está configurado. Confira as variáveis OAuth e reinicie o frontend.");
      return;
    }

    const googleAuthURL = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthURL.search = new URLSearchParams({
      redirect_uri: GoogleCallBackURI,
      prompt: "consent",
      response_type: "code",
      client_id: GoogleClientID,
      scope: "openid email profile",
      access_type: "offline",
    }).toString();
    window.location.replace(googleAuthURL.toString());
  };

  return (
    <ButtonCustom
      nameClass={nameClass}
      pic={"/static/svg/google.svg"}
      text={text}
      onClick={handleReachGoogle}
      isDisabled={isDisabled}
    />
  );
};

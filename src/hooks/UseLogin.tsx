import Axios from "@/config/axios";
import * as Api from "@/config/apiEndPoint";

const useLogin = async (
  email: string,
  password: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setDisplayError: React.Dispatch<React.SetStateAction<boolean>>,
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  setDetailError: React.Dispatch<React.SetStateAction<string>>,
  loginAction: (isAuthenticated?: boolean) => Promise<void>
) => {
  setLoading(true);
  setDisabled(true);
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await Axios.post(Api.loginEndpoint, body, config);

    localStorage.setItem("access", res.data.token.access);
    localStorage.setItem("refresh", res.data.token.refresh);
    setDisplayError(false);
    loginAction(true);
  } catch (error: any) {
    setLoading(false);
    setDisabled(false);
    setDisplayError(true);
    const responseErrors = error?.response?.data?.errors;
    const emailError = responseErrors?.email?.[0];
    const passwordError = responseErrors?.password?.[0];
    if (emailError || passwordError) {
      setDetailError(emailError || passwordError);
    } else {
      setDetailError("The email or the password is not valid!");
    }
    loginAction();
  }
};

export default useLogin;

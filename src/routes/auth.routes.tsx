import SignUp from "@/pages/auth/SignUp";
import Login from "@/pages/auth/Login";
import { TRoutesList } from "@/models";

const prfixPath: string = "/auth/user/"

export const authRoutes = {
  signup: {
    path: prfixPath + "signup",
    title: "Inscription | Twitter",
  },
  login: {
    path: prfixPath + "login",
    title: "Connexion | Twitter",
  },
};

export const authRoutesList: TRoutesList[] = [
  { path: authRoutes.signup.path, element: <SignUp /> },
  { path: authRoutes.login.path, element: <Login /> },
];

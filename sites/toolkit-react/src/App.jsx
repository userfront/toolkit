import "./App.css";
import "../../../packages/toolkit-react/src/themes/default.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { inspect } from "@xstate/inspect";
import SignupDemo from "./pages/SignupDemo";
import LoginDemo from "./pages/LoginDemo";
import ResetDemo from "./pages/ResetDemo";
import LogoutDemo from "./pages/LogoutDemo";
import SetNewPasswordDemo from "./pages/SetNewPasswordDemo";
import Index from "./pages/Index";
import Redirect from "./pages/Redirect";
import LiveSignupDemo from "./pages/LiveSignupDemo";
import LiveLoginDemo from "./pages/LiveLoginDemo";
import LiveResetDemo from "./pages/LiveResetDemo";
import LiveLogoutDemo from "./pages/LiveLogoutDemo";
import LiveSetNewPasswordDemo from "./pages/LiveSetNewPasswordDemo";

import Userfront from "../../../packages/toolkit-react/src/index.js";
import { useEffect } from "react";

Userfront.init("wbm95g4b");

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/signup",
    element: <SignupDemo />,
  },
  {
    path: "/login",
    element: <LoginDemo />,
  },
  {
    path: "/reset",
    element: <ResetDemo />,
  },
  {
    path: "/set-password",
    element: <SetNewPasswordDemo />,
  },
  {
    path: "/logout",
    element: <LogoutDemo />,
  },
  {
    path: "/live/login",
    element: <LiveLoginDemo />,
  },
  {
    path: "/live/signup",
    element: <LiveSignupDemo />,
  },
  {
    path: "/live/reset",
    element: <LiveResetDemo />,
  },
  {
    path: "/live/logout",
    element: <LiveLogoutDemo />,
  },
  {
    path: "/redirects/after-login",
    element: <Redirect type="after login" />,
  },
  {
    path: "/redirects/after-logout",
    element: <Redirect type="after logout" />,
  },
  {
    path: "/redirects/after-signup",
    element: <Redirect type="after signup" />,
  },
  {
    path: "/redirects/password-reset",
    element: <LiveSetNewPasswordDemo />,
  },
]);

const App = () => {
  useEffect(() => {
    const params = new URL(document.location).searchParams;
    if (params.get("inspect")) {
      inspect({
        iframe: false,
      });
    }
    window.Userfront = Userfront;
  }, []);

  return <RouterProvider router={router} />;
};

export default App;

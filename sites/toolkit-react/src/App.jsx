import "./App.css";
import "../../../packages/toolkit-react/src/themes/default.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignupDemo from "./pages/SignupDemo";
import LoginDemo from "./pages/LoginDemo";
import ResetDemo from "./pages/ResetDemo";
import LogoutDemo from "./pages/LogoutDemo";
import Index from "./pages/Index";

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
    path: "/logout",
    element: <LogoutDemo />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

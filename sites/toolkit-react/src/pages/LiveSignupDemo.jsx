import { useEffect } from "react";
import Userfront, {
  SignupForm,
} from "../../../../packages/toolkit-react/src/index.js";

function LiveSignupDemo() {
  const redirectOnLoad =
    new URL(window.location).searchParams.get("redirectOnLoad") === "true";
  return (
    <SignupForm
      compact={true}
      xstateDevTools={true}
      redirectOnLoadIfLoggedIn={redirectOnLoad}
    />
  );
}

export default LiveSignupDemo;

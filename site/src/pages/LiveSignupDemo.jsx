import { SignupForm } from "@userfront/toolkit/react";

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

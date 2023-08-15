import { LoginForm } from "@userfront/toolkit";

function LiveLoginDemo() {
  const redirectOnLoad =
    new URL(window.location).searchParams.get("redirectOnLoad") === "true";
  return (
    <LoginForm
      compact={false}
      xstateDevTools={true}
      redirectOnLoadIfLoggedIn={redirectOnLoad}
    />
  );
}

export default LiveLoginDemo;

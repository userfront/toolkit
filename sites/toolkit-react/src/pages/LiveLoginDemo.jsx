import { LoginForm } from "../../../../packages/toolkit-react/src/index.js";

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

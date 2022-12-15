import { LogoutButton } from "../../../../packages/toolkit-react/src/index.js";
import { useEnableGlobalUserfront } from "../hooks.js";

function LiveLogoutDemo() {
  useEnableGlobalUserfront();
  return <LogoutButton />;
}

export default LiveLogoutDemo;

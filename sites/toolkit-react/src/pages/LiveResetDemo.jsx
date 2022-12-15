import { PasswordResetForm } from "../../../../packages/toolkit-react/src/index.js";
import { useEnableGlobalUserfront } from "../hooks.js";

function LivePasswordResetDemo() {
  useEnableGlobalUserfront();
  return <PasswordResetForm />;
}

export default LivePasswordResetDemo;

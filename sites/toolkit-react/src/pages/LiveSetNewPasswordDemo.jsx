import { SetNewPasswordForm } from "../../../../packages/toolkit-react/src";
import { useEnableGlobalUserfront } from "../hooks.js";

function LiveSetNewPasswordDemo() {
  useEnableGlobalUserfront();
  return <SetNewPasswordForm />;
}

export default LiveSetNewPasswordDemo;

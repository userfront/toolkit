import { LoginForm } from "../../../../packages/toolkit-react/src/index.js";
import { useEnableGlobalUserfront } from "../hooks.js";

// TODO this should come from server when we have the flows/default endpoint up
const flow = {
  firstFactors: [
    { channel: "email", strategy: "password" },
    { channel: "email", strategy: "link" },
    { channel: "email", strategy: "verificationCode" },
    { channel: "sms", strategy: "verificationCode" },
  ],
  secondFactors: [
    { channel: "sms", strategy: "verificationCode" },
    { channel: "authenticator", strategy: "totp" },
  ],
  isMfaRequired: true,
};

function LiveLoginDemo() {
  useEnableGlobalUserfront();
  return (
    <LoginForm tenantId="6bg66q7n" flow={flow} compact={true} devMode={false} />
  );
}

export default LiveLoginDemo;

import { SignupForm } from "../../../../packages/toolkit-react/src/index.js";

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

function LiveSignupDemo() {
  return (
    <SignupForm
      tenantId="6bg66q7n"
      flow={flow}
      compact={true}
      devMode={false}
    />
  );
}

export default LiveSignupDemo;

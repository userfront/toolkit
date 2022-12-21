import { SignupForm } from "../../../../packages/toolkit-react/src/index.js";

// TODO this should come from server when we have the flows/default endpoint up
const flow = {
  firstFactors: [
    { channel: "email", strategy: "password" },
    { channel: "email", strategy: "link" },
    { channel: "email", strategy: "verificationCode" },
    { channel: "sms", strategy: "verificationCode" },
  ],
};

function LiveSignupDemo() {
  return <SignupForm flow={flow} compact={true} />;
}

export default LiveSignupDemo;

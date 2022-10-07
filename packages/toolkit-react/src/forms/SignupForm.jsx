import EnterEmail from "../views/EnterEmail";
import EnterPhone from "../views/EnterPhone";
import EnterVerificationCode from "../views/EnterVerificationCode";
import SelectFactor from "../views/SelectFactor";
import SetUpTotp from "../views/SetUpTotp";
import SetUpTotpSuccess from "../views/SetUpTotpSuccess";
import SignUpWithPassword from "../views/SignUpWithPassword";
import SecuredByUserfront from "../components/SecuredByUserfront";
import { log } from "../services/logging";

const Message = ({ message }) => {
  return <p>{message}</p>;
};

const Placeholder = () => {
  return <div className="uf-placeholder">...</div>;
};

const textForStep = (type) => {
  switch (type) {
    case "selectFirstFactor":
      return {
        title: "Sign up",
      };
    case "useSsoProvider":
      return {
        title: "Redirecting...",
      };
    case "enterEmailLink":
      return {
        title: "Email me a link",
      };
    case "linkSentByEmail":
      return {
        title: "Check your email",
      };
    case "enterEmailVerificationCode":
      return {
        title: "Email me a code",
      };
    case "verificationCodeSentByEmail":
      return {
        title: "Enter your verification code",
      };
    case "enterPhoneVerificationCode":
      return {
        title: "Text me a code",
      };
    case "verificationCodeSentBySms":
      return {
        title: "Enter your verification code",
      };
    case "signUpWithPassword":
      return {
        title: "Sign up",
      };
    case "signUpSuccess":
      return {
        title: "Signed up!",
      };
    case "selectSecondFactor":
      return {
        title: "Set up two-factor authentication",
      };
    case "setUpTotp":
      return {
        title: "Set up two-factor authentication",
      };
    case "setUpTotpSuccess":
      return {
        title: "Save your backup codes",
      };
    case "waitForFlow":
      return {
        title: "Sign up",
      };
  }
};

const componentForStep = (type) => {
  switch (type) {
    case "selectFirstFactor":
      return SelectFactor;
    case "useSsoProvider":
      return Message;
    case "enterEmailLink":
      return EnterEmail;
    case "linkSentByEmail":
      return Message;
    case "enterEmailVerificationCode":
      return EnterEmail;
    case "verificationCodeSentByEmail":
      return EnterVerificationCode;
    case "enterPhoneVerificationCode":
      return EnterPhone;
    case "verificationCodeSentBySms":
      return EnterVerificationCode;
    case "signUpWithPassword":
      return SignUpWithPassword;
    case "signUpSuccess":
      return Message;
    case "selectSecondFactor":
      return SelectFactor;
    case "setUpTotp":
      return SetUpTotp;
    case "setUpTotpSuccess":
      return SetUpTotpSuccess;
    case "waitForFlow":
      return Placeholder;
  }
};

const SignupForm = ({ state, onEvent }) => {
  const _onEvent = onEvent || ((evt) => log("event", evt));
  const text = textForStep(state.value);
  const title = text.title;
  const Component = componentForStep(state.value);

  return (
    <div className="uf-tool uf-signup-tool">
      <h2 className="uf-title">{title}</h2>
      <Component state={state} onEvent={_onEvent} />
      <div className="uf-secured-by">
        <SecuredByUserfront />
      </div>
    </div>
  );
};

export default SignupForm;

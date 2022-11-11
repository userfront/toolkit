import EnterEmail from "../views/EnterEmail";
import EnterPhone from "../views/EnterPhone";
import EnterVerificationCode from "../views/EnterVerificationCode";
import SelectFactor from "../views/SelectFactor";
import EnterTotpCode from "../views/EnterTotpCode";
import LogInWithPassword from "../views/LogInWithPassword";
import SecuredByUserfront from "../components/SecuredByUserfront";
import Message from "../views/Message";
import GeneralErrorMessage from "../views/GeneralErrorMessage";
import Success from "../views/Success";
import EmailLinkSent from "../views/EmailLinkSent";
import Placeholder from "../views/Placeholder";
import { log } from "../services/logging";
import { useState } from "react";
import { useSizeClass } from "../utils/hooks";

// Map a state node to component, title, and props
const componentForStep = (state) => {
  const type = state.value;
  let typeString = "";
  // Could be string or object of shape
  // {
  //   majorStep: "subStep"
  // }
  if (typeof type === "object") {
    const key = Object.keys(type)[0];
    const val = type[key];
    typeString = `${key}.${val}`;
  } else {
    typeString = type;
  }
  switch (typeString) {
    // While flow is being set up, show placeholder or preview as appropriate
    // TODO might need to tweak a little for placeholder vs preview? Not super important.
    case "init":
    case "getGlobalTenantId":
    case "initFlow":
    case "beginFlow":
    case "showPreviewAndFetchFlow":
    case "showPlaceholderAndFetchFlow":
      return {
        title: "Log in",
        Component: SelectFactor,
        props: {
          isPlaceholder: !!state.context.config.flow,
          isCompact: state.context.config.compact,
          loadingFactor: state.context.activeFactor,
          flow: state.context.config.flow,
          isSecondFactor: false,
          tenantId: state.context.tenantId,
          isLogin: true,
        },
      };

    // SelectFactor flow, with password possibly included inline
    case "selectFirstFactor.showForm":
      return {
        title: "Log in",
        Component: SelectFactor,
        props: {
          isCompact: state.context.config.compact,
          flow: state.context.config.flow,
          isSecondFactor: false,
          tenantId: state.context.tenantId,
          isLogin: true,
        },
      };
    case "selectFirstFactor.send":
      return {
        title: "Log in",
        Component: SelectFactor,
        props: {
          // isCompact should always be false here
          isCompact: state.context.config.compact,
          flow: state.context.config.flow,
          isSecondFactor: false,
          tenantId: state.context.tenantId,
          submittingPassword: true,
          isLogin: true,
        },
      };

    // SelectFactor flow for second factor,
    // with password possibly inlined
    case "beginSecondFactor":
    case "selectSecondFactor.showForm":
      return {
        title: "Log in",
        Component: SelectFactor,
        props: {
          isCompact: state.context.config.compact,
          flow: state.context.config.flow,
          isSecondFactor: true,
          allowedSecondFactors: state.context.allowedSecondFactors,
          tenantId: state.context.tenantId,
          isLogin: true,
        },
      };
    case "selectSecondFactor.send":
      return {
        title: "Log in",
        Component: SelectFactor,
        props: {
          // isCompact should always be false here
          isCompact: state.context.config.compact,
          flow: state.context.config.flow,
          isSecondFactor: true,
          allowedSecondFactors: state.context.allowedSecondFactors,
          tenantId: state.context.tenantId,
          submittingPassword: true,
          isLogin: true,
        },
      };

    // SSO provider flow, shouldn't be reached
    case "ssoProvider":
      // We should have already redirected to the relevant SSO provider
      return {
        title: "Redirecting...",
        Component: Message,
        props: {
          text: "",
        },
      };

    // EmailLink flow
    case "emailLink.showForm":
      return {
        title: "Email me a link",
        Component: EnterEmail,
        props: {
          errorMessage: state.context.errorMessage,
        },
      };
    case "emailLink.send":
      return {
        title: "Email me a link",
        Component: EnterEmail,
        props: {
          isLoading: true,
        },
      };
    case "emailLink.showEmailSent":
      return {
        title: "Check your email",
        Component: EmailLinkSent,
        props: {},
      };

    // EmailCode flow
    case "emailCode.showForm":
      return {
        title: "Email me a code",
        Component: EnterEmail,
        props: {},
      };
    case "emailCode.send":
      return {
        title: "Email me a code",
        Component: EnterEmail,
        props: {
          isLoading: true,
        },
      };
    case "emailCode.showCodeForm":
      return {
        title: "Enter your verification code",
        Component: EnterVerificationCode,
        props: {},
      };
    case "emailCode.verifyCode":
      return {
        title: "Enter your verification code",
        Component: EnterVerificationCode,
        props: {
          isLoading: true,
        },
      };
    case "emailCode.showCodeVerified":
      return {
        title: "Verified",
        Component: Success,
        props: {},
      };

    // SmsCode flow
    case "smsCode.showForm":
      return {
        title: "Text me a code",
        Component: EnterPhone,
        props: {},
      };
    case "smsCode.send":
      return {
        title: "Text me a code",
        Component: EnterPhone,
        props: {
          isLoading: true,
        },
      };
    case "smsCode.showCodeForm":
      return {
        title: "Enter your verification code",
        Component: EnterVerificationCode,
        props: {},
      };
    case "smsCode.verifyCode":
      return {
        title: "Enter your verification code",
        Component: EnterVerificationCode,
        props: {
          isLoading: true,
        },
      };
    case "smsCode.showCodeVerified":
      return {
        title: "Verified",
        Component: Success,
        props: {},
      };

    // Password flow (alone, not inline)
    case "password.showForm":
      return {
        title: "Log in",
        Component: LogInWithPassword,
        props: {},
      };
    case "password.send":
      return {
        title: "Log in",
        Component: LogInWithPassword,
        props: {
          isLoading: true,
        },
      };
    case "password.showPasswordSuccess":
      return {
        title: "Logged in",
        Component: Success,
      };

    // TOTP flow
    case "totpCode.showForm":
      return {
        title: "Enter your six-digit code",
        Component: EnterTotpCode,
        props: {
          errorMessage: state.context.errorMessage,
          useBackupCode: state.context.view.useBackupCode,
          showEmailOrUsername: state.context.view.showEmailOrUsername,
        },
      };
    case "totpCode.send":
      return {
        title: "Enter your six-digit code",
        Component: EnterTotpCode,
        props: {
          isLoading: true,
          useBackupCode: state.context.view.useBackupCode,
          showEmailOrUsername: state.context.view.showEmailOrUsername,
        },
      };
    case "totpCode.showTotpSuccess":
      return {
        title: "Verified",
        Component: Success,
        props: {},
      };

    // Top-level error messages
    case "missingFlowInDevModeError":
    case "missingFlowInLocalModeError":
    case "missingFlowFromServerError":
    case "UnhandledError":
      return {
        title: "Oops, something went wrong",
        Component: GeneralErrorMessage,
        props: {},
      };

    // Top-level "signed up" confirmation, in case we don't redirect
    case "finish":
      return {
        title: "Logged in",
        Component: Success,
        props: {},
      };

    // Shouldn't get here.
    // TODO in prod this should be a GeneralErrorMessage
    default:
      return () => {
        return <div>NO COMPONENT</div>;
      };
  }
};

// Some errors to use for testing instead of state.context.error
// TODO remove before prod!
const _error = {
  message: "This is a short error message.",
};

const _errorLong = {
  message:
    "This is a longer error message. Think about a cloud. Just float around and be there. It looks so good, I might as well not stop. I thought today we would do a happy little picture. Everybody's different. Trees are different. Let them all be individuals. You can do anything here - the only pre-requisite is that it makes you happy.",
};

const SignupForm = ({ state, onEvent }) => {
  const [containerRef, setContainerRef] = useState();
  const sizeClass = useSizeClass(containerRef);
  const _onEvent = onEvent || ((evt) => log("event", evt));
  // Get the view component, title text, and props corresponding to this state
  const { Component, props, title } = componentForStep(state);
  // Construct the default props that are passed to all views
  const defaultProps = {
    allowBack: state.context.allowBack,
    isSecondFactor: state.context.isSecondFactor,
    error: state.context.error,
    user: state.context.user,
  };

  return (
    <div ref={setContainerRef} className={`uf-toolkit-container ${sizeClass}`}>
      <h2>{title}</h2>
      <Component onEvent={_onEvent} {...defaultProps} {...props} />
      <div>
        <SecuredByUserfront />
      </div>
    </div>
  );
};

export default SignupForm;

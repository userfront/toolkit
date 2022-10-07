import IconButton from "../components/IconButton";
import SignUpWithPassword from "./SignUpWithPassword";
import Divider from "../components/Divider";
import { log } from "../services/logging";

const keyFor = (factor) => `${factor.channel}-${factor.strategy}`;

// TODO this is not great, should get these from one place / should be typed
const eventNameFor = (factor) => {
  switch (factor.strategy) {
    case "link": {
      return "SELECT_EMAIL_LINK";
    }
    case "password": {
      return "SELECT_PASSWORD";
    }
    case "totp": {
      return "SELECT_TOTP";
    }
    case "verificationCode": {
      if (factor.channel === "sms") {
        return "SELECT_SMS_CODE";
      } else {
        return "SELECT_EMAIL_CODE";
      }
    }
    default: {
      return "SELECT_SSO_PROVIDER";
    }
  }
};

const SelectFactor = ({ state, onEvent }) => {
  const _onEvent = onEvent || ((evt) => log("event", evt));
  const factors =
    state.current === "selectSecondFactor"
      ? state.context.flow.secondFactors
      : state.context.flow.firstFactors;
  const compact = !!state.context.compact;
  const displayItems = [];

  const handlePasswordSubmit = (event) => {
    _onEvent({
      ...event,
      type: "SUBMIT",
    });
  };

  const handleSelectFactor = (factor) => {
    _onEvent({
      factor,
      type: eventNameFor(factor),
    });
  };

  // Build list of buttons for factors,
  // with password button if in compact view,
  // or password entry if in default view
  for (let i = 0; i < factors.length; i++) {
    const factor = factors[i];
    if (factor.strategy !== "password") {
      displayItems.push(
        <IconButton
          factor={factor}
          onClick={() => handleSelectFactor(factor)}
          key={keyFor(factor)}
        />
      );
      continue;
    }
    if (compact) {
      displayItems.push(
        <IconButton
          factor={factor}
          onClick={() => handleSelectFactor(factor)}
          key={keyFor(factor)}
        />
      );
    } else {
      // Put dividers before and after, as appropriate
      if (i !== 0) {
        displayItems.push(<Divider text="or" key="before_password" />);
      }
      displayItems.push(
        <SignUpWithPassword
          key={keyFor(factor)}
          onSubmit={handlePasswordSubmit}
        />
      );
      if (i < factors.length - 1) {
        displayItems.push(<Divider text="or" key="after_password" />);
      }
    }
  }

  return <>{displayItems}</>;
};

export default SelectFactor;

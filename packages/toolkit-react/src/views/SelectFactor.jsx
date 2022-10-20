import IconButton from "../components/IconButton";
import SignUpWithPassword from "./SignUpWithPassword";
import Divider from "../components/Divider";
import { log } from "../services/logging";

const keyFor = (factor) => `${factor.channel}-${factor.strategy}`;

// TODO this is not great, should get these from one place / should be typed
const eventNameFor = (factor) => {
  switch (factor.strategy) {
    case "link": {
      return "selectEmailLink";
    }
    case "password": {
      return "selectPassword";
    }
    case "totp": {
      return "selectTotp";
    }
    case "verificationCode": {
      if (factor.channel === "sms") {
        return "selectSmsCode";
      } else {
        return "selectEmailCode";
      }
    }
    default: {
      return "selectSsoProvider";
    }
  }
};

const SelectFactor = ({
  flow,
  tenantId,
  isCompact = false,
  onEvent,
  allowedSecondFactors,
  isSecondFactor = false,
}) => {
  const _onEvent = onEvent || ((evt) => log("event", evt));
  console.log("flow", flow);
  const factors = isSecondFactor
    ? allowedSecondFactors || flow.secondFactors
    : flow.firstFactors;
  const displayItems = [];

  const handleSelectFactor = (factor) => {
    _onEvent({
      factor,
      type: "selectFactor",
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
    } else if (isCompact) {
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
          onEvent={_onEvent}
          allowBack={false}
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

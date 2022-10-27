import IconButton from "../components/IconButton";
import SignUpWithPassword from "./SignUpWithPassword";
import Divider from "../components/Divider";
import ErrorMessage from "../components/ErrorMessage";
import { log } from "../services/logging";

const keyFor = (factor) => `${factor.channel}-${factor.strategy}`;

const SelectFactor = ({
  flow,
  tenantId,
  isCompact = false,
  onEvent,
  allowedSecondFactors,
  isSecondFactor = false,
  error,
}) => {
  const _onEvent = onEvent || ((evt) => log("event", evt));
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

  let showingPassword = false;

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
      showingPassword = true;
      // Put dividers before and after, as appropriate
      if (i !== 0) {
        displayItems.push(<Divider text="or" key="before_password" />);
      }
      displayItems.push(
        <SignUpWithPassword
          key={keyFor(factor)}
          onEvent={_onEvent}
          allowBack={false}
          error={error}
        />
      );
      if (i < factors.length - 1) {
        displayItems.push(<Divider text="or" key="after_password" />);
      }
    }
  }

  return (
    <>
      {displayItems}
      {!showingPassword && <ErrorMessage error={error} />}
    </>
  );
};

export default SelectFactor;

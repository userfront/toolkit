import SignupForm from "../forms/SignupForm";
import createSignupFormMachine, {
  defaultAuthContext,
} from "../models/forms/signup";
import { useMachine } from "@xstate/react";

function PackagedSignupForm({
  tenantId,
  flow,
  compact,
  redirect,
  shouldFetchFlow = true,
  xstateDevTools = false,
}) {
  const [state, send] = useMachine(
    () => {
      const config = {
        ...defaultAuthContext.config,
      };
      if (tenantId) {
        config.tenantId = tenantId;
      }
      if (flow) {
        config.flow = flow;
      }
      config.compact = !!compact;
      config.shouldFetchFlow = !!shouldFetchFlow;
      config.redirect = redirect;
      const context = {
        ...defaultAuthContext,
        config,
      };
      return createSignupFormMachine(context);
    },
    { devTools: xstateDevTools }
  );

  return <SignupForm state={state} onEvent={send} />;
}

export default PackagedSignupForm;

import SignupForm from "../forms/SignupForm";
import createSignupFormMachine, { defaultAuthContext } from "../models/signup";
import { useMachine } from "@xstate/react";

function PackagedSignupForm({
  tenantId,
  flow,
  compact,
  devMode,
  shouldFetchFlow = true,
}) {
  const [state, send] = useMachine(() => {
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
    config.devMode = !!devMode;
    config.shouldFetchFlow = !!shouldFetchFlow;
    const context = {
      ...defaultAuthContext,
      config,
    };
    return createSignupFormMachine(context);
  });

  return <SignupForm state={state} onEvent={send} />;
}

export default PackagedSignupForm;

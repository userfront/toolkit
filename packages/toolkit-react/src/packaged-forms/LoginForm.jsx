import LoginForm from "../forms/LoginForm";
import createLoginFormMachine, {
  defaultAuthContext,
} from "../models/forms/login";
import { useMachine } from "@xstate/react";

function PackagedLoginForm({
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
    return createLoginFormMachine(context);
  });

  return <LoginForm state={state} onEvent={send} />;
}

export default PackagedLoginForm;

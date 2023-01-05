import LoginForm from "../forms/LoginForm";
import createLoginFormMachine, {
  defaultAuthContext,
} from "../models/forms/login";
import { useMachine } from "@xstate/react";

function PackagedLoginForm({
  tenantId,
  flow,
  compact,
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
      const context = {
        ...defaultAuthContext,
        config,
      };
      return createLoginFormMachine(context);
    },
    { devTools: xstateDevTools }
  );

  return <LoginForm state={state} onEvent={send} />;
}

export default PackagedLoginForm;

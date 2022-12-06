// Interface for userfront-core using the userfrontApi machine,
// for uniformity for Logout and PasswordReset forms that don't
// need a state machine to describe their behavior.

import { callUserfrontApi } from "../models/userfrontApi.ts";
import { interpret } from "xstate";

const call = async ({ method, args, isDevMode = false, _devDataType = "" }) => {
  const machine = callUserfrontApi.withContext({
    method,
    args,
    isDevMode,
    _devDataType,
    result: {},
    error: {},
  });

  return new Promise((resolve, reject) => {
    const service = interpret(machine).onTransition((state) => {
      if (state.matches("success") || state.matches("successDev")) {
        console.log("success");
        console.log(state.context);
        return resolve(state.context.result);
      }
      if (state.matches("failure")) {
        console.log("failure");
        console.log(state.context);
        return reject(state.context.error);
      }
    });
    service.start();
  });
};

export { READ } from "../models/userfrontApi.ts";

export default call;

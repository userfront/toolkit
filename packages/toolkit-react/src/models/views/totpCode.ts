import { callUserfront } from "../../services/userfront";
import { AuthMachineConfig, TotpCodeContext } from "../types";

// TOTP Authenticator state machine config
const totpCodeConfig: AuthMachineConfig = {
  id: "totpCode",
  initial: "showForm",
  entry: ["setupView", "setShowEmailOrUsernameIfFirstFactor"],
  states: {
    // Show the TOTP code entry form
    showForm: {
      on: {
        submit: {
          actions: "setTotpCode",
          target: "send",
        },
        useBackupCode: {
          actions: "setUseBackupCode",
        },
        // Go back to the factor selection view
        back: "#backToFactors",
      },
    },
    // Send the login request with the Userfront API
    send: {
      entry: "clearError",
      invoke: {
        // Set totpCode or backupCode and possibly emailOrUsername as arguments and call the method
        src: (_context) => {
          const context = <TotpCodeContext>_context;
          const arg: Record<string, string> = {
            method: "totp",
          };
          if (context.view.useBackupCode) {
            arg.backupCode = <string>context.view.backupCode;
          } else {
            arg.totpCode = context.view.totpCode;
          }
          if (context.view.emailOrUsername) {
            arg.emailOrUsername = context.view.emailOrUsername;
          }
          return callUserfront({
            method: context.config.type,
            args: [arg],
          });
        },
        // On error, store the error and return to the form
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },

        onDone: [
          // On success, proceed to second factor if required
          {
            actions: "setAllowedSecondFactors",
            target: "#beginSecondFactor",
            cond: "secondFactorRequired",
          },
          // Otherwise we're logged in; redirect, and show a confirmation view
          {
            actions: "redirectIfSignedIn",
            target: "showTotpSuccess",
          },
        ],
      },
    },
    sendBackupCode: {
      entry: "clearError",
      invoke: {
        // Set backupCode and possibly emailOrUsername as arguments and call the method
        src: (_context) => {
          const context = <TotpCodeContext>_context;
          const arg: Record<string, string> = {
            method: "totp",
            backupCode: <string>context.view.backupCode,
          };
          if (context.view.emailOrUsername) {
            arg.emailOrUsername = context.view.emailOrUsername;
          }
          return callUserfront({
            method: context.config.type,
            args: [arg],
          });
        },
        // On error, store the error and return to the form
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },
        onDone: [
          // On success, proceed to second factor if required
          {
            actions: "setAllowedSecondFactors",
            target: "#beginSecondFactor",
            cond: "secondFactorRequired",
          },
          // Otherwise we're logged in; redirect, and show a confirmation view
          {
            actions: "redirectIfSignedIn",
            target: "showTotpSuccess",
          },
        ],
      },
    },
    // Show a confirmation view, in case we don't redirect
    showTotpSuccess: {
      type: "final",
    },
  },
};

export default totpCodeConfig;

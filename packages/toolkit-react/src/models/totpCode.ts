import { AuthMachineConfig, TotpCodeContext } from "./types";
import { callUserfrontApi } from "./userfrontApi";
import { hasValue } from "./utils";

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
        src: callUserfrontApi,
        // Set totpCode and possibly emailOrUsername as arguments and call the method
        data: (context: TotpCodeContext, event: any) => {
          const args = {
            method: "totp",
          } as any;
          if (context.view.useBackupCode) {
            args.backupCode = context.view.backupCode;
          } else {
            args.totpCode = context.view.totpCode;
          }
          if (context.view.emailOrUsername) {
            args.emailOrUsername = context.view.emailOrUsername;
          }
          return {
            method: "login",
            args,
          };
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
        // Store the error and return to the form
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },
      },
    },
    sendBackupCode: {
      entry: "clearError",
      invoke: {
        src: callUserfrontApi,
        // Set backupCode and possibly emailOrUsername as arguments and call the method
        data: (context: TotpCodeContext, event: any) => {
          const args = {
            method: "totp",
            backupCode: context.view.totpCode,
          } as any;
          if (context.view.emailOrUsername) {
            args.emailOrUsername = context.view.emailOrUsername;
          }
          return {
            method: "login",
            args,
          };
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
        // Store the error and return to the form
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },
      },
    },
    // Show a confirmation view, in case we don't redirect
    showTotpSuccess: {
      type: "final",
    },
  },
};

export default totpCodeConfig;

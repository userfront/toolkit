import { callUserfront } from "../../services/userfront";
import {
  AuthMachineConfig,
  SignupMachineEvent,
  TotpCodeSubmitEvent,
} from "../types";

// TOTP Authenticator setup state machine config
const setUpTotpConfig: AuthMachineConfig = {
  id: "totpCode",
  initial: "getQrCode",
  entry: "setupView",
  states: {
    // First we need to get the QR code from the Userfront API,
    // so we can show it
    getQrCode: {
      invoke: {
        // Method will exist on userfront-core when published
        // @ts-ignore
        src: () => callUserfront({ method: "getTotp" }),
        // If there's a problem getting the QR code, show an error message
        onError: {
          actions: "setErrorFromApiError",
          target: "showErrorMessage",
        },
        // Once we have the QR code, show the form
        onDone: {
          actions: "setQrCode",
          target: "showQrCode",
        },
      },
    },
    // Show the form with QR code + field to verify it works
    showQrCode: {
      on: {
        // Store the TOTP code the user entered so we can verify it
        submit: {
          actions: "setTotpCode",
          target: "confirmTotpCode",
        },
        // Go back to the factor selection view
        back: "#backToFactors",
      },
    },
    // Confirm the TOTP setup is correct by using a TOTP code
    // Doesn't seem to be technically required, but it's good practice
    confirmTotpCode: {
      entry: "clearError",
      invoke: {
        // Set the code and call the API method
        src: (context: any, event: SignupMachineEvent) =>
          callUserfront({
            method: context.config.type,
            args: [
              {
                method: "totp",
                totpCode: (<TotpCodeSubmitEvent>event).totpCode,
              },
            ],
          }),
        // On error, show the error message and return to the form
        onError: {
          actions: "setErrorFromApiError",
          target: "showQrCode",
        },

        // When verified, show the backup codes so the user can record them
        onDone: {
          actions: "storeFactorResponse",
          target: "showBackupCodes",
        },
      },
    },
    // Show the user's backup codes once TOTP setup succeeds
    showBackupCodes: {
      on: {
        // Proceed to the second factor if required,
        // otherwise show a message and redirect
        finish: [
          {
            actions: "setAllowedSecondFactorsFromView",
            target: "#beginSecondFactor",
            cond: "secondFactorRequiredFromView",
          },
          {
            actions: "redirectIfSignedIn",
            target: "showTotpSetupComplete",
          },
        ],
      },
    },
    // Show an error message only - if there's a problem getting
    // the QR code.
    showErrorMessage: {
      on: {
        retry: "getQrCode",
        back: "#backToFactors",
      },
    },
    // Show a confirmation screen, in case we don't redirect.
    showTotpSetupComplete: {
      type: "final",
    },
  },
};

export default setUpTotpConfig;

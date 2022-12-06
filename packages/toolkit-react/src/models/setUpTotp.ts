import { AuthMachineConfig, TotpCodeContext } from "./types";
import { callUserfrontApi } from "./userfrontApi";

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
        src: callUserfrontApi,
        data: (context: TotpCodeContext, event: any) => ({
          method: "getTotpAuthenticatorQrCode",
          args: {},
        }),
        // Once we have the QR code, show the form
        onDone: [
          // If there's a problem getting the QR code, show an error message
          {
            actions: "setErrorFromApiError",
            target: "showErrorMessage",
            cond: "isUserfrontError",
          },
          {
            actions: "setQrCode",
            target: "showQrCode",
          },
        ],
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
        src: callUserfrontApi,
        // Set the code and call the API method
        data: (context: TotpCodeContext, event: any) => ({
          method: "signup",
          args: {
            method: "totp",
            totpCode: event.totpCode,
          },
        }),
        // When verified, show the backup codes so the user can record them
        onDone: [
          // On error, show the error message and return to the form
          {
            actions: "setErrorFromApiError",
            target: "showQrCode",
            cond: "isUserfrontError",
          },
          {
            actions: "storeFactorResponse",
            target: "showBackupCodes",
          },
        ],
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

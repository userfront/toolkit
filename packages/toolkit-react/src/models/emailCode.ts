import { AuthMachineConfig, EmailCodeContext } from "./types";
import { callUserfrontApi } from "./userfrontApi";
import { hasValue } from "./utils";

const emailCodeConfig: AuthMachineConfig = {
  id: "emailCode",
  initial: "showForm",
  entry: "setupView",
  states: {
    // Show the form to enter an email address
    showForm: {
      on: {
        // When the user submits, store the email locally and proceed to send it with the Userfront API
        submit: {
          actions: "setEmail",
          target: "send",
        },
        // When the user presses the back button, go back to the preceding factor selection screen
        back: "#backToFactors",
      },
    },
    // Send the code email via the Userfront API
    send: {
      entry: "clearError",
      invoke: {
        src: callUserfrontApi,
        // Set method, email, and possibly name and username as arguments for the call
        data: (context: EmailCodeContext, event: any) => {
          const args = {
            method: "verificationCode",
            email: context.user.email,
          } as any;
          if (hasValue(context.user.name)) {
            args.name = context.user.name;
          }
          if (hasValue(context.user.username)) {
            args.username = context.user.username;
          }
          return {
            method: "signup",
            args,
          };
        },
        // On success, ask the user to enter the verification code
        onDone: {
          target: "showCodeForm",
        },
        // On failure, set the error message and return to the entry form
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },
      },
    },
    // Show the form asking the user to enter the verification code
    showCodeForm: {
      on: {
        // On submit, store and then verify the code
        submit: {
          actions: "setCode",
          target: "verifyCode",
        },
        // The user can ask to resend the code to the same email address
        resend: "send",
        // The user can go back to the email entry screen to use a different email address
        back: "showForm",
      },
    },
    // Check the verification code via the Userfront API
    verifyCode: {
      entry: "clearError",
      invoke: {
        src: callUserfrontApi,
        // Set the arguments and call the Userfront API method to check the verification code
        // TODO this is not quite right?
        data: (context: EmailCodeContext, event: any) => {
          const args = {
            method: "verificationCode",
            email: context.user.email,
            verificationCode: context.view.code,
          } as any;
          return {
            method: "sendVerificationCode",
            args,
          };
        },
        onDone: [
          // If we need to enter a second factor, proceed to that step
          {
            actions: "setAllowedSecondFactors",
            target: "#beginSecondFactor",
            cond: "secondFactorRequired",
          },
          // Otherwise, we're signed in, redirect.
          // Show the "verified" view in case redirect fails.
          {
            actions: "redirectIfSignedIn",
            target: "showCodeVerified",
          },
        ],
        // On error, show the error message on the code entry form
        onError: {
          actions: "setErrorFromApiError",
          target: "showCodeForm",
        },
      },
    },
    // Show a "verified" view, so we have something to show if there's nowhere to redirect to
    showCodeVerified: {
      type: "final",
    },
  },
};

export default emailCodeConfig;

import { SignupMachineConfig, EmailLinkContext } from "./types";
import { callUserfrontApi } from "./userfrontApi";
import { hasValue } from "./utils";

const emailLinkConfig: SignupMachineConfig = {
  id: "emailLink",
  initial: "showForm",
  entry: "setupView",
  states: {
    // Show the form to enter an email
    showForm: {
      on: {
        // When the user submits, store the email locally and proceed to send the request
        submit: {
          actions: "setEmail",
          target: "send",
        },
        // When the user presses the back button, go back to the prior (first, second) factor selection view
        back: "#backToFactors",
      },
    },
    // Request to send the email link to the given email,
    // and report success or failure.
    send: {
      // If there's currently an error message, clear it - don't show stale errors!
      entry: "clearError",
      // Call the Userfront API login/signup with passwordless method
      invoke: {
        src: callUserfrontApi,
        // Set the method and email, and name and/or username if present, as arguments
        data: (context: EmailLinkContext, event: any) => {
          const args = {
            method: "passwordless",
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
        // On success, show that the email was sent
        onDone: {
          target: "showEmailSent",
        },
        // On failure, store the error and return to the email entry screen so we can try again
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },
      },
    },
    // The email was successfully sent, show a message
    showEmailSent: {
      on: {
        // The user asks to resend the email to the same address
        resend: "send",
        // The user presses the back button (i.e. to correct their email and send)
        back: "showForm",
      },
    },
  },
};

export default emailLinkConfig;

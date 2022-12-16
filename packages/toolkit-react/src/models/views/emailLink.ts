import { AuthMachineConfig } from "../types";
import { callUserfront } from "../../services/userfront";
import { hasValue } from "../config/utils";

const emailLinkConfig: AuthMachineConfig = {
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
        // Set the method and email, and name and/or username if present, as arguments
        src: (context) => {
          const arg: Record<string, string> = {
            method: "passwordless",
            email: context.user.email,
          };
          if (hasValue(context.user.name)) {
            arg.name = context.user.name;
          }
          if (hasValue(context.user.username)) {
            arg.username = context.user.username;
          }
          return callUserfront({
            method: context.config.type,
            args: [arg],
          });
        },
        // On failure, store the error and return to the email entry screen so we can try again
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },
        // On success, show that the email was sent
        onDone: {
          target: "showEmailSent",
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

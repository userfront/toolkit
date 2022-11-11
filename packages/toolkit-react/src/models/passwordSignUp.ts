// State machine for the "username and password" view

import { AuthMachineConfig, PasswordContext } from "./types";
import { callUserfrontApi } from "./userfrontApi";
import { hasValue } from "./utils";

// Note - could be running in parallel with the "select a factor" view
const passwordConfig: AuthMachineConfig = {
  id: "password",
  initial: "showForm",
  entry: "setupView",
  states: {
    // Show the username, password, confirm password form
    showForm: {
      on: {
        submit: [
          // If password === confirmPassword, then submit the request to Userfront
          {
            actions: "setPassword",
            target: "send",
            cond: "passwordsMatch",
          },
          // If password !== confirmPassword, then show an error
          {
            actions: "setErrorForPasswordMismatch",
            target: "showForm",
          },
        ],
        // Go back to the factor selection view
        back: "#backToFactors",
      },
    },
    // Send the signup request with the Userfront API
    send: {
      entry: "clearError",
      invoke: {
        src: callUserfrontApi,
        // Set email, password, and possibly name and/or username as arguments and call the method
        data: (context: PasswordContext, event: any) => {
          const args = {
            method: "password",
            email: context.user.email,
            password: context.view.password,
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
            target: "showPasswordSet",
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
    showPasswordSet: {
      type: "final",
    },
  },
};

export default passwordConfig;

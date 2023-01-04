// State machine for the "username and password" view

import { AuthMachineConfig, PasswordContext } from "../types";
import { callUserfront } from "../../services/userfront";
import { hasValue } from "../config/utils";

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
        // Set email, password, and possibly name and/or username as arguments and call the method
        src: (context) => {
          console.log(context);
          const arg: Record<string, string> = {
            method: "password",
            email: context.user.email,
            password: (<PasswordContext>context).view.password,
          };
          if (hasValue(context.user.name)) {
            arg.name = context.user.name;
          }
          if (hasValue(context.user.username)) {
            arg.username = context.user.username;
          }
          if (hasValue(context.user.emailOrUsername)) {
            arg.emailOrUsername = context.user.emailOrUsername;
          }
          console.log(context.config.type);
          console.log(arg);
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
            actions: "redirectIfLoggedIn",
            target: "showPasswordSet",
          },
        ],
      },
    },
    // Show a confirmation view, in case we don't redirect
    showPasswordSet: {
      type: "final",
    },
  },
};

export default passwordConfig;

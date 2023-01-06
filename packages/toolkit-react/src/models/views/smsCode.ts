// State machine config for the "text me a code" view

import { AuthMachineConfig, SmsCodeContext } from "../types";
import { callUserfront } from "../../services/userfront";
import { hasValue } from "../config/utils";

// Virtually identical to the "email me a code" machine above - see that one for more details
const smsCodeConfig: AuthMachineConfig = {
  id: "smsCode",
  initial: "showForm",
  entry: "setupView",
  states: {
    showForm: {
      on: {
        submit: {
          actions: "setPhoneNumber",
          target: "send",
        },
        back: "#backToFactors",
      },
    },
    send: {
      entry: "clearError",
      invoke: {
        src: (context) => {
          const arg: Record<string, string> = {
            channel: "sms",
            phoneNumber: (<SmsCodeContext>context).view.phoneNumber,
          };
          if (hasValue(context.user.name)) {
            arg.name = context.user.name;
          }
          if (hasValue(context.user.username)) {
            arg.username = context.user.username;
          }
          return callUserfront({
            method: "sendVerificationCode",
            args: [arg],
          });
        },
        // On failure, set the error message and return to the entry form
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },
        // On success, ask the user to enter the verification code
        onDone: {
          target: "showCodeForm",
        },
      },
    },
    showCodeForm: {
      on: {
        submit: {
          actions: "setCode",
          target: "verifyCode",
        },
        resend: "send",
        back: "showForm",
      },
    },
    verifyCode: {
      entry: "clearError",
      invoke: {
        src: (context) =>
          callUserfront({
            method: context.config.type,
            args: [
              {
                method: "verificationCode",
                channel: "sms",
                phoneNumber: (<SmsCodeContext>context).view.phoneNumber,
                verificationCode: (<SmsCodeContext>context).view.code,
              },
            ],
          }),
        // On error, show the error message on the code entry form
        onError: {
          actions: "setErrorFromApiError",
          target: "showCodeForm",
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
            actions: "redirectIfLoggedIn",
            target: "showCodeVerified",
          },
        ],
      },
    },
    showCodeVerified: {
      type: "final",
    },
  },
};

export default smsCodeConfig;

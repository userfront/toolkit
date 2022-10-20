// State machine config for the "text me a code" view

import { SignupMachineConfig, SmsCodeContext } from "./types";
import { callUserfrontApi } from "./userfrontApi";
import { hasValue } from "./utils";

// Virtually identical to the "email me a code" machine above - see that one for more details
const smsCodeConfig: SignupMachineConfig = {
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
        src: callUserfrontApi,
        data: (context: SmsCodeContext, event: any) => {
          const args = {
            method: "verificationCode",
            channel: "sms",
            phoneNumber: context.view.phoneNumber,
          } as any;
          if (hasValue(context.user.email)) {
            args.email = context.user.email;
          }
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
        onDone: {
          target: "showCodeForm",
        },
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
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
        src: callUserfrontApi,
        data: (context: SmsCodeContext, event: any) => {
          const args = {
            method: "verificationCode",
            channel: "sms",
            verificationCode: context.view.code,
          } as any;
          return {
            method: "sendVerificationCode",
            args,
          };
        },
        onDone: [
          {
            actions: "setAllowedSecondFactors",
            target: "#beginSecondFactor",
            cond: "secondFactorRequired",
          },
          {
            actions: "redirectIfSignedIn",
            target: "showCodeVerified",
          },
        ],
        onError: {
          actions: "setErrorFromApiError",
          target: "showCodeForm",
        },
      },
    },
    showCodeVerified: {
      type: "final",
    },
  },
};

export default smsCodeConfig;
import { assign, send } from "xstate";
import {
  UserfrontApiErrorEvent,
  AuthContext,
  Password,
  View,
  SelectFactorEvent,
  CommonFormData,
  EmailSubmitEvent,
  EmailCodeContext,
  SmsCodeContext,
  CodeSubmitEvent,
  PasswordContext,
  PasswordSubmitEvent,
  PhoneNumberSubmitEvent,
  TotpCodeContext,
  UserfrontApiFetchQrCodeEvent,
  TotpCodeSubmitEvent,
  UserfrontApiFactorResponseEvent,
  UserfrontApiGetTenantIdEvent,
  UserfrontApiFetchFlowEvent,
  TotpCode,
  UseBackupCodeEvent,
} from "./types";
import { getTargetForFactor, factorConfig, hasValue } from "./utils";
// @ts-ignore
import callUserfront from "../services/userfront";

// Clear the current error message, if any
export const clearError = assign({ error: undefined });

// Set the error message from a Userfront API error
export const setErrorFromApiError = assign({
  errorMessage: (context, event: UserfrontApiErrorEvent) => event.data,
});

// Create & set the error message for a password mismatch (password !== confirmPassword)
export const setErrorForPasswordMismatch = assign({
  error: {
    statusCode: 0,
    message: "The passwords don't match. Please re-enter your password.",
    error: {
      type: "password_mismatch_error",
    },
  },
});

// Disable back actions
export const disableBack = assign({
  allowBack: false,
});

// Enable back actions
export const enableBack = assign({
  allowBack: true,
});

// Set up the view for the selected factor
export const setupView = (
  context: AuthContext<View>,
  event: SelectFactorEvent
) => {
  const target = getTargetForFactor(event.factor) as keyof typeof factorConfig;

  // If we're not on a factor, we must be on factor selection,
  // which extends the Password context

  if (!target) {
    return assign({
      view: {
        password: "",
      },
    });
  }

  // Set up the view for this factor
  if (factorConfig[target]) {
    const factorView = factorConfig[target].viewContext;
    return assign({
      view: factorView,
    });
  }
  // We're on an unrecognized factor, so can't set anything except the base view
  return assign({
    view: {} as CommonFormData,
  });
};

// Store the user's email (and possibly name and username too)
export const setEmail = assign({
  user: (context, event: EmailSubmitEvent) => ({
    email: event.email,
    name: event.name,
    username: event.username,
  }),
});

// Store the verification code so we can send it
export const setCode = assign(
  (
    context: Pick<EmailCodeContext | SmsCodeContext, "view">,
    event: CodeSubmitEvent
  ) => ({
    view: {
      ...context.view,
      code: event.code,
    },
  })
);

// Store the user's password (and at least one of email, name, username) so we can send it
export const setPassword = assign(
  (context: PasswordContext, event: PasswordSubmitEvent) => ({
    user: {
      email: event.email,
      name: event.name,
      username: event.username,
    },
    view: {
      ...context.view,
      password: event.password,
    },
  })
);

// Store the user's phone number so we can send it
export const setPhoneNumber = assign(
  (context: SmsCodeContext, event: PhoneNumberSubmitEvent) => ({
    view: {
      ...context.view,
      phoneNumber: event.phoneNumber,
    },
  })
);

// Store the TOTP setup QR code we received from the server, so we can display it
export const setQrCode = assign(
  (context: TotpCodeContext, event: UserfrontApiFetchQrCodeEvent) => ({
    view: {
      ...context.view,
      qrCode: event.data.qrCode,
      backupCodes: event.data.backupCodes,
    },
  })
);

// Store the TOTP code the user entered, so we can send it
export const setTotpCode = assign(
  (context: TotpCodeContext, event: TotpCodeSubmitEvent) => ({
    view: {
      ...context.view,
      totpCode: event.totpCode ?? "",
      emailOrUsername: event.emailOrUsername ?? "",
    },
  })
);

export const setUseBackupCode = assign(
  (context: TotpCodeContext, event: UseBackupCodeEvent) => ({
    view: {
      ...context.view,
      useBackupCode: event.useBackupCode,
    },
  })
);

export const setShowEmailOrUsernameIfFirstFactor = (
  context: TotpCodeContext
) => {
  return assign({
    view: {
      ...context.view,
      showEmailOrUsername: context.isSecondFactor,
    },
  });
};

export const storeFactorResponse = assign(
  (context: TotpCodeContext, event: UserfrontApiFactorResponseEvent) => ({
    view: {
      ...context.view,
      isMfaRequired: event.data.isMfaRequired,
      allowedSecondFactors: event.data.authentication?.secondFactors || [],
    },
  })
);

// Store the allowed second factors, from the response to a successful first factor login.
// allowedSecondFactors is not necessarily identical to config.flow.secondFactors, because
// the user could have specific second factors set.
export const setAllowedSecondFactors = assign(
  (context: AuthContext<any>, event: UserfrontApiFactorResponseEvent) => ({
    allowedSecondFactors: event.data.authentication.secondFactors,
  })
);

// Same as above, but set from context.view instead of event.data
// for views that don't proceed directly from the API request to
// the second factor selection
export const setAllowedSecondFactorsFromView = assign(
  (context: TotpCodeContext) => ({
    allowedSecondFactors: context.view.allowedSecondFactors,
  })
);

// Mark that the form should be showing & working with second factors
export const markAsSecondFactor = assign({
  isSecondFactor: true,
});

// Redirect to the afterLoginPath etc. after signed in, just an alias for the Userfront API method
export const redirectIfSignedIn = () => {
  callUserfront({ method: "redirectIfSignedIn" });
};

// Set the tenantId based on what was returned from the Userfront API, or set isDevMode = true if
// there is no tenantId set in the local Userfront SDK instance
export const setTenantIdOrDevMode = (
  context: AuthContext<any>,
  event: UserfrontApiGetTenantIdEvent
) => {
  if (hasValue(event.data.tenantId)) {
    return assign({
      config: {
        ...context.config,
        tenantId: event.data.tenantId,
      },
    });
  } else {
    return assign({
      config: {
        ...context.config,
        devMode: true,
      },
    });
  }
};

// Set the auth flow based on what was returned from the Userfront API
export const setFlowFromUserfrontApi = (
  context: AuthContext<any>,
  event: UserfrontApiFetchFlowEvent
) =>
  assign({
    config: {
      ...context.config,
      flow: event.data,
    },
  });

// Once we've gotten the auth flow from the Userfront server,
// if we're in preview mode we need to set the auth flow in the context
// and then, if the user had already clicked a factor button, continue
// the flow if that factor is still available.
export const setFlowFromUserfrontApiAndResume = (
  context: AuthContext<any>,
  event: UserfrontApiFetchFlowEvent
) => {
  const actionList = [];
  actionList.push(
    assign({
      config: {
        ...context.config,
        flow: event.data,
      },
    })
  );
  // TODO could be a factor not available in the server flow
  if (context.activeFactor) {
    const target = getTargetForFactor(context.activeFactor);
    actionList.push(send(target));
  }
  return actionList;
};

// Set the active factor, the factor that we're currently viewing.
// This is really just for the specific case when we're in "preview mode"
// (a local auth flow was provided, and we were told to fetch the flow from the server)
// and the user clicks a factor.

// The factor that we're currently viewing is almost always dictated
// by the state node we're in rather than context, this
export const setActiveFactor = (
  context: AuthContext<any>,
  event: SelectFactorEvent
) => ({
  config: {
    ...context.config,
    activeFactor: event.factor,
  },
});

/* UNIT TESTS */
import { Factor } from "./types";
import { createAuthContextForFactor } from "../../test/utils";

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  describe("models/actions.ts", () => {
    describe("setupView", () => {
      it("should set up the Password view context if no factor is given", () => {
        const event = {
          type: "selectFactor",
          factor: {} as Factor,
          isSecondFactor: false,
        };
        const expected = assign({
          view: {
            password: "",
          },
        });
        const actual = setupView(
          {} as AuthContext<any>,
          event as SelectFactorEvent
        );
        expect(actual).toEqual(expected);
      });
      Object.entries(factorConfig).forEach(([key, factorData]) => {
        it(`should set up the correct context for the ${key} factor`, () => {
          const event = {
            type: "selectFactor",
            factor: {
              channel: factorData.channel,
              strategy: factorData.strategy,
            },
            isSecondFactor: false,
          };
          const expected = assign({
            view: factorData.viewContext,
          });
          const actual = setupView(
            {} as AuthContext<any>,
            event as SelectFactorEvent
          );
          expect(actual).toEqual(expected);
        });
      });
    });
    describe("setTenantIdOrDevMode", () => {
      it("should set the tenantId if one is available", () => {
        const event = {
          type: "done" as any,
          data: {
            tenantId: "demo1234",
          },
        };
        const context = createAuthContextForFactor("password");
        const expected = assign({
          config: {
            ...context.config,
            tenantId: "demo1234",
          },
        });
        const actual = setTenantIdOrDevMode(context, event);
        expect(actual).toEqual(expected);
      });
      it("should set dev mode if no tenantId is available", () => {
        const event = {
          type: "done" as any,
          data: {
            tenantId: "",
          },
        };
        const context = createAuthContextForFactor("password");
        const expected = assign({
          config: {
            ...context.config,
            devMode: true,
          },
        });
        const actual = setTenantIdOrDevMode(context, event);
        expect(actual).toEqual(expected);
      });
    });
  });
}

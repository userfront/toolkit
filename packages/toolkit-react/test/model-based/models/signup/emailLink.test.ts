import { describe, it, beforeEach, expect } from "vitest";
import emailLinkConfig from "../../../../src/models/views/emailLink";
import { createMachine, interpret } from "xstate";
import { createTestMachine, createTestModel } from "@xstate/test";
import * as realActions from "../../../../src/models/config/actions";
import { useMockUserfront, addBackToFactorsState } from "../../../utils";
import { defaultAuthContext } from "../../../../src/models/forms/signup";

const machineOptions = {
  actions: {
    setEmail: realActions.setEmail,
    clearError: realActions.clearError,
    setupView: realActions.setupView,
    setErrorFromApiError: realActions.setErrorFromApiError,
  },
};

const emailLinkMachine = createMachine(
  addBackToFactorsState(emailLinkConfig),
  <any>machineOptions
).withContext(defaultAuthContext);

const testMachine = createTestMachine({
  initial: "showingForm",
  states: {
    showingForm: {
      on: {
        submit: "submittingFromForm",
        back: "returnedToFactors",
      },
    },
    submittingFromForm: {
      on: {
        fail: "showingFormWithError",
        succeed: "showingEmailSent",
      },
    },
    showingFormWithError: {
      on: {
        submit: "submittingFromForm",
        back: "returnedToFactors",
      },
    },
    showingEmailSent: {
      on: {
        resend: "submittingFromEmailSent",
        back: "showingForm",
      },
    },
    submittingFromEmailSent: {
      on: {
        fail: "showingEmailSentWithResendError",
        succeed: "showingEmailResent",
      },
    },
    showingEmailResent: {
      on: {
        resend: "submittingFromEmailSent",
        back: "showingForm",
      },
    },
    showingEmailSentWithResendError: {
      on: {
        resend: "submittingFromEmailSent",
        back: "showingForm",
      },
    },
    returnedToFactors: {},
  },
});

const testModel = createTestModel(testMachine);

describe("model-based: models/signup/emailLink", () => {
  testModel.getPaths().forEach((path) => {
    it(path.description, async () => {
      const emailLinkService = interpret(emailLinkMachine);
      emailLinkService.start();
      const mockUserfront = useMockUserfront();
      const email = "email@example.com";
      const error = {
        message: "An error",
        error: {
          type: "some type",
        },
      };

      await path.test({
        states: {
          showingForm: () => {
            const state = emailLinkService.getSnapshot();
            expect(state.value).toEqual("showForm");
            expect(state.context.error).toBeFalsy();
          },
          submittingFromForm: () => {
            const state = emailLinkService.getSnapshot();
            expect(state.value).toEqual("send");
            expect(state.context.error).toBeFalsy();
            expect(mockUserfront.lastCall.method).toEqual("signup");
            const arg = mockUserfront.lastCall.args[0];
            expect(arg.method).toEqual("passwordless");
            expect(arg.email).toEqual(email);
          },
          showingFormWithError: () => {
            const state = emailLinkService.getSnapshot();
            expect(state.value).toEqual("showForm");
            expect(state.context.error).toEqual(error);
            expect(state.context.user.email).toEqual(email);
          },
          showingEmailSent: () => {
            const state = emailLinkService.getSnapshot();
            expect(state.value).toEqual("showEmailSent");
            expect(state.context.error).toBeFalsy();
            expect(state.context.user.email).toEqual(email);
          },
          // TODO should be a new state?
          submittingFromEmailSent: () => {
            const state = emailLinkService.getSnapshot();
            expect(state.value).toEqual("send");
            expect(state.context.error).toBeFalsy();
            expect(state.context.user.email).toEqual(email);
            expect(mockUserfront.lastCall.method).toEqual("signup");
            const arg = mockUserfront.lastCall.args[0];
            expect(arg.method).toEqual("passwordless");
            expect(arg.email).toEqual(email);
          },
          showingEmailResent: () => {
            const state = emailLinkService.getSnapshot();
            expect(state.value).toEqual("showEmailSent");
            expect(state.context.error).toBeFalsy();
            expect(state.context.user.email).toEqual(email);
          },
          showingEmailSentWithResendError: () => {
            const state = emailLinkService.getSnapshot();
            expect(state.value).toEqual("showForm");
            expect(state.context.error).toEqual(error);
            expect(state.context.user.email).toEqual(email);
          },
          returnedToFactors: () => {
            const state = emailLinkService.getSnapshot();
            expect(state.value).toEqual("backToFactors");
          },
        },
        events: {
          submit: () => {
            emailLinkService.send("submit", { email });
          },
          back: () => {
            emailLinkService.send("back");
          },
          fail: async () => {
            try {
              await mockUserfront.reject(error);
            } catch (err) {
              await Promise.resolve();
              return;
            }
          },
          succeed: async () => {
            await mockUserfront.resolve({});
          },
          resend: () => {
            emailLinkService.send("resend");
          },
        },
      });

      mockUserfront.restoreUserfront();
    });
  });
});

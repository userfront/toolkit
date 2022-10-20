import passwordConfig from "./passwordSignUp";
import { SignupMachineConfig } from "./types";
import { signupFactors } from "./utils";

const selectFactorConfig: SignupMachineConfig = {
  // The SelectFactor config needs to extend the Password config,
  // because the SelectFactor view could have the Password view inlined.
  id: "selectFactor",
  initial: "showForm",
  entry: ["setupView", "enableBack"],
  states: {
    // Bring over the Password state nodes, and override the showForm
    // node to add SelectFactor events to it.
    ...passwordConfig.states!,
    showForm: {
      on: {
        // Bring over the Password events
        ...passwordConfig.states!.showForm.on,
        // When the user selects a factor, proceed to that factor's view.
        selectFactor: [
          ...Object.values(signupFactors).map((factor) => ({
            target: `#${factor.name}`,
            cond: factor.testIs,
          })),
          // This should be exhaustive; if we fall through to here without
          // matching a factor, that means the user selected a factor we don't have a view for.

          // Duplicates, should never be reached.
          // Only here to help out the XCode visualizer.
          {
            target: "#emailLink",
            cond: "isEmailLink",
          },
          {
            target: "#emailCode",
            cond: "isEmailCode",
          },
          {
            target: "#smsCode",
            cond: "isSmsCode",
          },
          {
            target: "#password",
            cond: "isPassword",
          },
          {
            target: "#setUpTotp",
            cond: "isTotp",
          },
          {
            target: "#ssoProvider",
            cond: "isSsoProvider",
          },

          // If we get here, it's an unhandled condition, show an error
          {
            target: "#unhandledError",
          },
        ],
      },
    },
    // If we signed up with a password, no second factor is required, and
    // we didn't redirect, show the top-level "finished" state
    showPasswordSet: {
      always: "#finish",
    },
  },
};

export default selectFactorConfig;

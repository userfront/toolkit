// "Unbound" forms: the signup and login forms without a model to drive their behavior
import { default as UnboundUniversalForm } from "../forms/UniversalForm";

// Factories for creating models to pair with the unbound forms
import {
  default as createUniversalFormModel,
  defaultAuthContext as defaultUniversalFormContext,
} from "../models/forms/universal";

import { useMockUserfront } from "../utils/mockUserfront.js";

import { useMachine } from "@xstate/react";
import { useEffect } from "react";

const context = {
  ...defaultUniversalFormContext,
};

const brightness = (hexColor) => {
  const hasFullSpec = color.length == 7;
  var m = color.substr(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g);
  if (m)
    var r = parseInt(m[0] + (hasFullSpec ? "" : m[0]), 16),
      g = parseInt(m[1] + (hasFullSpec ? "" : m[1]), 16),
      b = parseInt(m[2] + (hasFullSpec ? "" : m[2]), 16);
  if (typeof r != "undefined") return (r * 299 + g * 587 + b * 114) / 1000;
};

const SignupFormModel = createUniversalFormModel(context);
const DemoForm = ({ type, theme }) => {
  const demoTheme = {
    colors: {
      light: "#ec6279",
      dark: "#333335",
      accent: "#6a6a6a",
    },
    fonts: {},
  };

  context.config.type = type;

  const mockUserfront = useMockUserfront();

  const machine = SignupFormModel;
  const machineOptions = {};
  const [state, send] = useMachine(machine, machineOptions);

  useEffect(() => {
    mockUserfront.attachToWindow();
  }, []);

  const handleEvent = (event) => {
    send(event);
  };

  return (
    <UnboundUniversalForm
      state={state}
      onEvent={handleEvent}
      customTheme={demoTheme}
    />
  );
};

export default DemoForm;

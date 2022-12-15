import {
  argsForVariables,
  argTypesForVariables,
} from "../../../.storybook/decorators/css-variables";
import GeneralErrorMessage from "../../views/GeneralErrorMessage";
import FixedWidth from "../utils/FixedWidth";
import ViewContainer from "../utils/ViewContainer";

const cssVariables = [
  "--uf-toolkit-text-color",
  "--uf-toolkit-background-color",
  "--uf-toolkit-container-border-color",
  "--uf-toolkit-container-border",
  "--uf-toolkit-border-radius",
  "--uf-toolkit-container-box-shadow",
  "--uf-toolkit-spacing",
  "--uf-toolkit-container-margin",
  "--uf-toolkit-container-width",
  "--uf-toolkit-container-max-width",
  "--uf-toolkit-container-height",
  "--uf-toolkit-container-max-height",
  "--uf-toolkit-font-family",
  "--uf-toolkit-alignment",
  "--uf-toolkit-em-size",
];

const sizeClasses = {
  "uf-toolkit-tiny": "uf-toolkit-tiny",
  "uf-toolkit-small": "uf-toolkit-small",
  "uf-toolkit-medium": "uf-toolkit-medium",
  "uf-toolkit-large": "uf-toolkit-large",
};

export default {
  title: "Views/General (fatal) error message",
  component: GeneralErrorMessage,
  argTypes: {
    error: {
      name: "Error message",
      description:
        "The message associated with the error. If there is no message, an 'unknown error' message is shown.",
      control: "text",
    },
    size: {
      name: "Size",
      type: { name: "string", required: true },
      description:
        "Width breakpoints for the view. Select one to view the form at that breakpoint.",
      control: "radio",
      options: [
        "uf-toolkit-tiny",
        "uf-toolkit-small",
        "uf-toolkit-medium",
        "uf-toolkit-large",
      ],
      mapping: sizeClasses,
      labels: {
        "uf-toolkit-tiny": "Tiny (<= 250px)",
        "uf-toolkit-small": "Small (<= 350px)",
        "uf-toolkit-medium": "Medium (<= 500px)",
        "uf-toolkit-large": "Large (> 500px)",
      },
      if: { arg: "width", truthy: false },
    },
    width: {
      name: "Width of container",
      type: { name: "number", required: false },
      description:
        "Views fill their container by default. Set the container width, or 0 to fill the Storybook container. If set, disables the size option above.",
      control: "number",
    },

    ...argTypesForVariables(cssVariables),
  },
  parameters: {
    passStyle: true,
  },
};

export const Default = (args, { style }) => {
  const error = args.error ? { message: args.error } : null;
  if (args.width) {
    let sizeClass = "uf-toolkit-large";
    if (args.width <= 500) {
      sizeClass = "uf-toolkit-medium";
    }
    if (args.width <= 350) {
      sizeClass = "uf-toolkit-small";
    }
    if (args.width <= 250) {
      sizeClass = "uf-toolkit-tiny";
    }
    return (
      <FixedWidth width={args.width}>
        <ViewContainer style={style} sizeClass={sizeClass} title={args.title}>
          <GeneralErrorMessage error={error} onEvent={() => {}} />
        </ViewContainer>
      </FixedWidth>
    );
  }
  let width;
  switch (args.size) {
    case "uf-toolkit-large":
      width = 650;
      break;
    case "uf-toolkit-medium":
      width = 450;
      break;
    case "uf-toolkit-small":
      width = 300;
      break;
    case "uf-toolkit-tiny":
      width = 200;
      break;
  }
  return (
    <FixedWidth width={width}>
      <ViewContainer style={style} sizeClass={args.size} title={args.title}>
        <GeneralErrorMessage error={error} onEvent={() => {}} />
      </ViewContainer>
    </FixedWidth>
  );
};
Default.args = {
  error:
    "This view is only shown for a fatal error, most likely during development.",
  size: "uf-toolkit-medium",
  width: 0,
  ...argsForVariables(cssVariables),
};
Default.storyName = "General (fatal) error message";

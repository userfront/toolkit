import {
  argsForVariables,
  argTypesForVariables,
} from "../../../.storybook/decorators/css-variables";
import EnterTotpCode from "../../views/EnterTotpCode";
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
  title: "EnterTotpCode",
  component: EnterTotpCode,
  argTypes: {
    allowBack: {
      name: "Allow navigating back",
      description: "Should the view offer a Back button to the user?",
      control: "boolean",
    },
    error: {
      name: "Error message",
      description: "If there is an error message, the view will show it.",
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

const Template = (args, { style }) => {
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
          <EnterTotpCode
            allowBack={args.allowBack}
            error={error}
            onEvent={() => {}}
          />
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
        <EnterTotpCode
          allowBack={args.allowBack}
          error={error}
          onEvent={() => {}}
        />
      </ViewContainer>
    </FixedWidth>
  );
};

export const Default = Template.bind({});
Default.args = {
  allowBack: true,
  error: "",
  size: "uf-toolkit-medium",
  width: 0,
  ...argsForVariables(cssVariables),
};

export const WithError = Template.bind({});
WithError.args = {
  allowBack: true,
  error: "That code was not correct. Please try again.",
  size: "uf-toolkit-medium",
  width: 0,
  ...argsForVariables(cssVariables),
};
WithError.storyName = "With error message";

export const NoBack = Template.bind({});
NoBack.args = {
  allowBack: false,
  error: "",
  size: "uf-toolkit-medium",
  width: 0,
  ...argsForVariables(cssVariables),
};
NoBack.storyName = "Without back button";

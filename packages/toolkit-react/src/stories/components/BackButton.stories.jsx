import BackButton from "../../components/BackButton";
import {
  argTypesForVariables,
  argsForVariables,
  stripVariablesFromArgs,
} from "../../../.storybook/decorators/css-variables";
import FixedWidth from "../utils/FixedWidth";
import makePseudoStory from "../utils/pseudo";

const cssVariables = [
  "--uf-toolkit-secondary-color",
  "--uf-toolkit-secondary-color-text",
  "--uf-toolkit-secondary-button-border",
  "--uf-toolkit-secondary-button-border-color",
  "--uf-toolkit-border-radius",
  "--uf-toolkit-secondary-color-active",
  "--uf-toolkit-secondary-button-border-active",
  "--uf-toolkit-secondary-button-border-active-color",
  "--uf-toolkit-secondary-button-box-shadow-active",
  "--uf-toolkit-secondary-color-focus",
  "--uf-toolkit-secondary-button-border-focus",
  "--uf-toolkit-secondary-button-border-focus-color",
  "--uf-toolkit-button-hover-transform",
  "--uf-toolkit-spacing",
  "--uf-toolkit-button-padding",
  "--uf-toolkit-button-font-size",
  "--uf-toolkit-font-family",
  "--uf-toolkit-em-size",
];

export default {
  title: "Components/Back button",
  component: BackButton,
  argTypes: {
    text: {
      name: "Text content",
      type: { name: "string", required: false },
      description:
        "Text content of the back button. Omit to use the default value.",
      control: {
        type: "text",
      },
    },
    width: {
      name: "Width of container",
      type: { name: "number", required: false },
      description:
        "Buttons fill their container by default. To simulate a fixed-width container, set the width here, in px, or set to 0 to unset the container width.",
      control: {
        type: "number",
      },
    },
    ...argTypesForVariables(cssVariables),
  },
};

const Template = (args) => {
  const newArgs = { ...args };
  delete newArgs.text;
  delete newArgs.width;
  if (args.text) {
    return (
      <FixedWidth width={args.width}>
        <BackButton {...stripVariablesFromArgs(newArgs)}>
          {args.text}
        </BackButton>
      </FixedWidth>
    );
  }
  return (
    <FixedWidth width={args.width}>
      <BackButton {...stripVariablesFromArgs(args)} />
    </FixedWidth>
  );
};

export const Default = Template.bind({});
Default.args = { text: "", width: 400, ...argsForVariables(cssVariables) };

export const CustomText = Template.bind({});
CustomText.args = {
  text: "Custom text",
  width: 400,
  ...argsForVariables(cssVariables),
};
CustomText.storyName = "With custom text";

export const Hover = makePseudoStory(Default, "hover");
export const Focus = makePseudoStory(Default, "focus");

import SubmitButton from "../../components/SubmitButton";
import {
  argTypesForVariables,
  argsForVariables,
  stripVariablesFromArgs,
} from "../../../.storybook/decorators/css-variables";
import FixedWidth from "../utils/FixedWidth";
import makePseudoStory from "../utils/pseudo";

const cssVariables = [
  "--uf-toolkit-primary-color",
  "--uf-toolkit-primary-color-text",
  "--uf-toolkit-primary-button-border",
  "--uf-toolkit-primary-button-border-color",
  "--uf-toolkit-border-radius",
  "--uf-toolkit-primary-color-active",
  "--uf-toolkit-primary-button-border-active",
  "--uf-toolkit-primary-button-border-active-color",
  "--uf-toolkit-primary-button-box-shadow-active",
  "--uf-toolkit-primary-color-focus",
  "--uf-toolkit-primary-button-border-focus",
  "--uf-toolkit-primary-button-border-focus-color",
  "--uf-toolkit-button-hover-transform",
  "--uf-toolkit-spacing",
  "--uf-toolkit-button-padding",
  "--uf-toolkit-button-font-size",
  "--uf-toolkit-font-family",
  "--uf-toolkit-em-size",
];

export default {
  title: "Components/Submit button",
  component: SubmitButton,
  argTypes: {
    text: {
      name: "Text content",
      type: { name: "string", required: false },
      description:
        "Text content of the submit button. Omit to use the default value.",
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
        <SubmitButton {...stripVariablesFromArgs(newArgs)}>
          {args.text}
        </SubmitButton>
      </FixedWidth>
    );
  }
  return (
    <FixedWidth width={args.width}>
      <SubmitButton {...stripVariablesFromArgs(newArgs)} />
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

import SubmitButton from "../../components/SubmitButton";
import {
  argTypesForVariables,
  argsForVariables,
  stripVariablesFromArgs,
} from "../../../.storybook/decorators/css-variables";

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
  "--uf-toolkit-spacing",
  "--uf-toolkit-button-padding",
  "--uf-toolkit-button-font-size",
  "--uf-toolkit-font-family",
  "--uf-toolkit-em-size",
];

export default {
  title: "Submit button",
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
    ...argTypesForVariables(cssVariables),
  },
};

const Template = (args) => {
  if (args.text) {
    const newArgs = { ...args };
    delete newArgs.text;
    return (
      <SubmitButton {...stripVariablesFromArgs(newArgs)}>
        {args.text}
      </SubmitButton>
    );
  }
  return <SubmitButton {...stripVariablesFromArgs(args)} />;
};

export const Default = Template.bind({});
Default.args = { text: "", ...argsForVariables(cssVariables) };

export const CustomText = Template.bind({});
CustomText.args = { text: "Custom text", ...argsForVariables(cssVariables) };
CustomText.storyName = "With custom text";

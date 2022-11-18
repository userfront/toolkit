import ContinueButton from "../../components/ContinueButton";
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
  title: "Continue button",
  component: ContinueButton,
  argTypes: {
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
  delete newArgs.width;
  return (
    <FixedWidth width={args.width}>
      <ContinueButton {...stripVariablesFromArgs(args)} />
    </FixedWidth>
  );
};

export const Default = Template.bind({});
Default.args = { width: 400, ...argsForVariables(cssVariables) };

export const Hover = makePseudoStory(Default, "hover");
export const Focus = makePseudoStory(Default, "focus");

import RetryButton from "../../components/RetryButton";
import {
  argTypesForVariables,
  argsForVariables,
  stripVariablesFromArgs,
} from "../../../.storybook/decorators/css-variables";
import FixedWidth from "../utils/FixedWidth";
import makePseudoStory from "../utils/pseudo";

const cssVariables = [
  "--uf-toolkit-spacing",
  "--uf-toolkit-button-padding",
  "--uf-toolkit-subtle-button-font-size",
  "--uf-toolkit-link-color",
  "--uf-toolkit-font-family",
  "--uf-toolkit-em-size",
];

export default {
  title: "Retry button",
  component: RetryButton,
  argTypes: {
    text: {
      name: "Text content",
      type: { name: "string", required: false },
      description: "Text content of the button, or the default value if blank.",
      control: {
        type: "text",
      },
    },
    ...argTypesForVariables(cssVariables),
  },
};

const Template = (args) => {
  const newArgs = { ...args };
  delete newArgs.text;
  delete newArgs.width;
  return (
    <FixedWidth width={args.width}>
      <RetryButton {...stripVariablesFromArgs(newArgs)}>
        {args.text}
      </RetryButton>
    </FixedWidth>
  );
};

export const Default = Template.bind({});
Default.args = { text: "", width: 400, ...argsForVariables(cssVariables) };

export const Hover = makePseudoStory(Default, "hover");
export const Focus = makePseudoStory(Default, "focus");

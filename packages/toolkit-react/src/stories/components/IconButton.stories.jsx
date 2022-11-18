import IconButton from "../../components/IconButton";
import {
  argTypesForVariables,
  argsForVariables,
  stripVariablesFromArgs,
} from "../../../.storybook/decorators/css-variables";
import FixedWidth from "../utils/FixedWidth";
import makePseudoStory from "../utils/pseudo";

const cssVariables = [
  "--uf-toolkit-button-icon-size",
  "--uf-toolkit-text-color",
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

const factorForName = {
  Apple: {
    channel: "email",
    strategy: "apple",
  },
  Azure: {
    channel: "email",
    strategy: "azure",
  },
  Facebook: {
    channel: "email",
    strategy: "facebook",
  },
  Github: {
    channel: "email",
    strategy: "github",
  },
  Google: {
    channel: "email",
    strategy: "google",
  },
  LinkedIn: {
    channel: "email",
    strategy: "linkedin",
  },
  Twitter: {
    channel: "email",
    strategy: "twitter",
  },
  "Username and password": {
    channel: "email",
    strategy: "password",
  },
  "Email link (passwordless)": {
    channel: "email",
    strategy: "link",
  },
  "Authenticator app or device (TOTP)": {
    channel: "authenticator",
    strategy: "totp",
  },
  "SMS verification code": {
    channel: "sms",
    strategy: "verificationCode",
  },
  "Email verification code": {
    channel: "email",
    strategy: "verificationCode",
  },
};

export default {
  title: "Icon button",
  component: IconButton,
  argTypes: {
    factor: {
      name: "Factor or provider",
      description: "The factor or SSO provider to show with this icon button",
      control: {
        type: "radio",
      },
      options: [
        "Apple",
        "Azure",
        "Facebook",
        "Github",
        "Google",
        "LinkedIn",
        "Twitter",
        "Username and password",
        "Email link (passwordless)",
        "Authenticator app or device (TOTP)",
        "SMS verification code",
        "Email verification code",
      ],
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
  delete newArgs.width;
  const factor = factorForName[args.factor];
  newArgs.factor = factor;
  return (
    <FixedWidth width={args.width}>
      <IconButton {...stripVariablesFromArgs(newArgs)} />
    </FixedWidth>
  );
};

export const Default = Template.bind({});
Default.args = {
  factor: "Apple",
  width: 400,
  ...argsForVariables(cssVariables),
};

export const Hover = makePseudoStory(Default, "hover");
export const Focus = makePseudoStory(Default, "focus");

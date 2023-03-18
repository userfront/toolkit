import SetNewPasswordForm from "../../forms/SetNewPasswordForm";
import FixedWidth from "../utils/FixedWidth";

export default {
  title: "Forms/Set new password form",
  component: SetNewPasswordForm,
  argTypes: {
    width: {
      name: "Width of container",
      type: { name: "number", required: false },
      description:
        "Views fill their container by default. Set the container width, or 0 to fill the Storybook container. If set, disables the size option above.",
      control: "number",
    },
    shouldConfirmPassword: {
      name: "Require password confirmation",
      type: {
        name: "boolean",
        required: false,
      },
    },
  },
  parameters: {
    passStyle: true,
  },
};

export const Default = (args) => {
  if (args.width) {
    return (
      <FixedWidth width={args.width}>
        <SetNewPasswordForm
          shouldConfirmPassword={args.shouldConfirmPassword}
        />
      </FixedWidth>
    );
  }
  let width;
  return (
    <FixedWidth width={width}>
      <SetNewPasswordForm shouldConfirmPassword={args.shouldConfirmPassword} />
    </FixedWidth>
  );
};
Default.args = {
  width: 340,
  shouldConfirmPassword: false,
};
Default.storyName = "Set new password form";

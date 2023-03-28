import PasswordResetForm from "../../forms/PasswordResetForm";
import FixedWidth from "../utils/FixedWidth";

export default {
  title: "Forms/Password reset form",
  component: PasswordResetForm,
  argTypes: {
    width: {
      name: "Width of container",
      type: { name: "number", required: false },
      description:
        "Views fill their container by default. Set the container width, or 0 to fill the Storybook container. If set, disables the size option above.",
      control: "number",
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
        <PasswordResetForm />
      </FixedWidth>
    );
  }
  let width;
  return (
    <FixedWidth width={width}>
      <PasswordResetForm />
    </FixedWidth>
  );
};
Default.args = {
  width: 340,
};
Default.storyName = "Password reset form";

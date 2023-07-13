import RequestPasswordResetForm from "../../forms/RequestPasswordResetForm";
import FixedWidth from "../utils/FixedWidth";

export default {
  title: "Forms/Request password reset form",
  component: RequestPasswordResetForm,
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
        <RequestPasswordResetForm />
      </FixedWidth>
    );
  }
  let width;
  return (
    <FixedWidth width={width}>
      <RequestPasswordResetForm />
    </FixedWidth>
  );
};
Default.args = {
  width: 340,
};
Default.storyName = "Password reset form";

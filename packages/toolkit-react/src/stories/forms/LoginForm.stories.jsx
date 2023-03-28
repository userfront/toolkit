import LoginForm from "../../forms/LoginForm";
import FixedWidth from "../utils/FixedWidth";

export default {
  title: "Forms/Login form",
  component: LoginForm,
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

// export const Default = (args) => {
//   if (args.width) {
//     return (
//       <FixedWidth width={args.width}>
//         <LoginForm />
//       </FixedWidth>
//     );
//   }
//   let width;
//   return (
//     <FixedWidth width={width}>
//       <LoginForm />
//     </FixedWidth>
//   );
// };
// Default.args = {
//   width: 340,
// };
// Default.storyName = "Login form";

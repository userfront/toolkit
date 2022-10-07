import IconButton from "./IconButton";

const SsoButton = ({ provider }) => {
  return <IconButton factor={{ channel: "email", strategy: provider }} />;
};

export default SsoButton;

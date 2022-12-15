import IconButton from "./IconButton";

const SsoButton = ({ provider, onEvent }) => {
  const handleClick = (evt) => {
    if (onEvent) {
      onEvent({
        type: "selectFactor",
        factor: {
          channel: "email",
          strategy: provider,
        },
      });
    }
  };
  return (
    <IconButton
      onClick={handleClick}
      factor={{ channel: "email", strategy: provider }}
    />
  );
};

export default SsoButton;

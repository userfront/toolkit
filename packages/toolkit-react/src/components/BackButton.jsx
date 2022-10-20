const BackButton = ({ onEvent, onClick, ...props }) => {
  const handleClick = (evt) => {
    if (onEvent) {
      onEvent({
        type: "back",
      });
    }
    if (onClick) {
      onClick(evt);
    }
  };
  return (
    <button type="button" {...props} onClick={handleClick}>
      Back
    </button>
  );
};

export default BackButton;

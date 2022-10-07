const BackButton = ({ onBack, onClick, ...props }) => {
  const handleClick = (evt) => {
    if (onBack) {
      onBack({
        type: "BACK",
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

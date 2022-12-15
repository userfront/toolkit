const BackButton = ({ onEvent, onClick, children, ...props }) => {
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

  const content = children || "Back";
  return (
    <button
      className="uf-toolkit-button uf-toolkit-button-secondary"
      type="button"
      {...props}
      onClick={handleClick}
    >
      {content}
    </button>
  );
};

export default BackButton;

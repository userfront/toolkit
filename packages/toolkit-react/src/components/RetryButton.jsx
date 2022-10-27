const RetryButton = (props) => {
  const message = props.children || "Retry";
  const onClick = props.onClick || (() => {});
  return (
    <button
      className="uf-toolkit-button uf-toolkit-button-subtle"
      onClick={onClick}
      {...props}
    >
      {message}
    </button>
  );
};

export default RetryButton;

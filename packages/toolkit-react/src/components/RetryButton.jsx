const RetryButton = (props) => {
  const message = props.children || "Retry";
  const onClick = props.onClick || (() => {});
  return (
    <button onClick={onClick} {...props}>
      {message}
    </button>
  );
};

export default RetryButton;

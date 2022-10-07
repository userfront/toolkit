const RetryButton = (props) => {
  const message = props.children || "Retry";
  return <button {...props}>{message}</button>;
};

export default RetryButton;

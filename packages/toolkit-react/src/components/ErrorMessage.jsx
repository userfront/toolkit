const ErrorMessage = ({ error }) => {
  const classes = ["uf-toolkit-error"];
  const hasError = !!error;
  if (hasError) {
    classes.push("uf-toolkit-has-error");
  }
  const message =
    error?.message || "An unknown error has occurred. Please try again later.";
  return (
    <div className={classes.join(" ")}>
      {hasError && <span className="uf-toolkit-error-text">{message}</span>}
    </div>
  );
};

export default ErrorMessage;

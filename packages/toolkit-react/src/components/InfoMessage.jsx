const InfoMessage = ({ message }) => {
  const classes = ["uf-toolkit-info-message"];
  const hasMessage = !!message;
  if (hasMessage) {
    classes.push("uf-toolkit-has-info-message");
  }
  return (
    <div className={classes.join(" ")} role="alert">
      {hasMessage && (
        <span className="uf-toolkit-info-message-text">{message}</span>
      )}
    </div>
  );
};

export default InfoMessage;

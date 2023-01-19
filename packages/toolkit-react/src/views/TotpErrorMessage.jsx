import BackButton from "../components/BackButton";
import RetryButton from "../components/RetryButton";
import ErrorMessage from "../components/ErrorMessage";

/**
 * An error message specifically for cases where we encounter an error
 * when trying to get the TOTP setup information (QR code).
 *
 * @param {object} props
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
const TotpErrorMessage = ({ onEvent, allowBack, error }) => {
  const handleRetry = () => {
    onEvent({
      type: "retry",
    });
  };
  return (
    <div>
      <p>
        Uh oh, we couldn't retrieve your authenticator setup information. Please
        choose a different method, or try again later.
      </p>
      <ErrorMessage error={error} />
      {allowBack && <BackButton onEvent={onEvent} />}
      <RetryButton onClick={handleRetry}>Retry</RetryButton>
    </div>
  );
};

export default TotpErrorMessage;

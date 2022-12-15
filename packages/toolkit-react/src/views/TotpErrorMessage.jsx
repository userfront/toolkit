import BackButton from "../components/BackButton";
import RetryButton from "../components/RetryButton";
import ErrorMessage from "../components/ErrorMessage";

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

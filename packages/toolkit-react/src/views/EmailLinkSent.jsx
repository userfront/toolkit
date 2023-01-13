import BackButton from "../components/BackButton";
import RetryButton from "../components/RetryButton";
import InfoMessage from "../components/InfoMessage";

const EmailLinkSent = ({ onEvent, user, message }) => {
  const onResend = () => {
    onEvent({
      type: "resend",
    });
  };
  return (
    <div>
      <p>A link has been sent to {user.email}.</p>
      <InfoMessage message={message} />
      <div className="uf-toolkit-button-row">
        <BackButton onEvent={onEvent} />
        <RetryButton onClick={onResend}>Resend</RetryButton>
      </div>
    </div>
  );
};

export default EmailLinkSent;

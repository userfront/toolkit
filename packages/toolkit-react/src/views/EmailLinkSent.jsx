import BackButton from "../components/BackButton";
import RetryButton from "../components/RetryButton";

const EmailLinkSent = ({ onEvent, user }) => {
  const onResend = () => {
    onEvent({
      type: "resend",
    });
  };
  return (
    <div>
      <p>A link has been sent to {user.email}.</p>
      <div>
        <BackButton onEvent={onEvent} />
        <RetryButton onClick={onResend}>Resend</RetryButton>
      </div>
    </div>
  );
};

export default EmailLinkSent;

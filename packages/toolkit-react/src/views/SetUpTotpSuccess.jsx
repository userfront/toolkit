import SubmitButton from "../components/SubmitButton";

const SetUpTotpSuccess = ({ backupCodes, onEvent }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onEvent({
      type: "SUBMIT",
    });
  };

  return (
    <>
      <p>
        These are your backup codes. Each of these codes can be used once to log
        in, in place of the code from your authenticator app or device. Write
        these codes down and store them in a safe place.
      </p>
      <ul>
        {backupCodes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>
      <SubmitButton onClick={handleSubmit}>Finish</SubmitButton>
    </>
  );
};

export default SetUpTotpSuccess;

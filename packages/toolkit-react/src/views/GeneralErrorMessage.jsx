import ErrorMessage from "../components/ErrorMessage";

const GeneralErrorMessage = ({ error }) => {
  return (
    <div>
      <p>Uh oh, an unhandled error occurred. Please try again later.</p>
      <ErrorMessage error={error} />
    </div>
  );
};

export default GeneralErrorMessage;

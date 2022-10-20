const ErrorMessage = ({ error }) => {
  if (!error || !error.message) {
    return null;
  }
  return <div>Error: {error.message}</div>;
};

export default ErrorMessage;

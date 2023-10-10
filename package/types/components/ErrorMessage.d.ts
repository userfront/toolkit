export default ErrorMessage;
/**
 * Displays an error message given a Userfront error.
 * Displays nothing if no error is passed, so can be safely included
 * regardless of whether there's an error.
 * If the error lacks a message, gives an "unknown error" message.
 *
 * @param {object} props
 * @param {object} props.error - the error returned from Userfront
 * @returns
 */
declare function ErrorMessage({
  error,
}: {
  error: object;
}): import("react").JSX.Element;

export default GeneralErrorMessage;
/**
 * A view that's exclusively an error message, for unhandled, unrecoverable errors
 * that prevent entering the flow.
 * Errors within flows are shown in the regular UI.
 *
 * @param {object} props
 * @param {object} error - a Userfront error to display
 */
declare function GeneralErrorMessage({
  error,
}: object): import("react").JSX.Element;
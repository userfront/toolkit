export default Success;
/**
 * Show a success message, and a continue button if a redirect URL is provided.
 * @param {object} props
 * @param {string} props.redirect - URL to redirect to. If
 * @returns
 */
declare function Success({
  redirect,
}: {
  redirect: string;
}): import("react").JSX.Element;

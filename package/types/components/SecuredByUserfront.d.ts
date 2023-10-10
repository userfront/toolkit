export default SecuredByUserfront;
/**
 * A "Secured by Userfront" logo and text.
 * Also contains the notice if this is test mode.
 *
 * @param {object} props
 * @param {string} props.mode - the mode, "test" or "live"
 * @returns
 */
declare function SecuredByUserfront({
  mode,
}: {
  mode: string;
}): import("react").JSX.Element;

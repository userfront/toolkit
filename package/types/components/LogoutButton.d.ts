export default LogoutButton;
/**
 * A functioning logout button.
 *
 * @param {props} props
 * @param {boolean} props.disabled - is the button disabled?
 * @param {string | boolean} props.redirect - URL to redirect to. If false, disables redirect.
 *  If absent, redirect based on the tenant's after-logout path.
 * @param {array} props.children - children to display in the button. Shows "Log out" if children are absent.
 * @returns
 */
declare function LogoutButton({
  redirect,
  disabled,
  children,
}: props): import("react").JSX.Element;

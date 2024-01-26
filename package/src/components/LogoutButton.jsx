import { callUserfront } from "../services/userfront";

/**
 * A functioning logout button.
 *
 * @param {object} props
 * @param {boolean=} props.disabled - is the button disabled?
 * @param {object=} props.theme - theme information: color scheme, font, sizing, options
 * @param {string=} props.theme.colors.light - light color to use when deriving color scheme
 * @param {string=} props.theme.colors.dark - dark color to use when deriving color scheme
 * @param {object=} props.theme.colors - theme colors
 * @param {string=} props.theme.colors.accent - accent color to use when deriving color scheme (optional)
 * @param {string=} props.theme.colors.lightBackground - background color for light mode (optional)
 * @param {string=} props.theme.colors.darkBackground - background color for dark mode (optional)
 * @param {string=} props.theme.fontFamily - CSS font family to use for the form
 * @param {object=} props.theme.options - additional options to modify the form's appearance
 * @param {boolean=} props.theme.options.rounded - make form elements appear more rounded generally
 * @param {boolean=} props.theme.options.squared - make form elements appear more squared-off generally
 * @param {boolean=} props.theme.options.gradientButtons - add an interactive gradient to buttons
 * @param {boolean=} props.theme.options.hideSecuredMessage - hide the "secured by Userfront" message
 * @param {(string|boolean)=} props.redirect - URL to redirect to. If false, disables redirect.
 *  If absent, redirect based on the tenant's after-logout path.
 * @param {array=} props.children - children to display in the button. Shows "Log out" if children are absent.
 * @returns
 */
const LogoutButton = ({ redirect, disabled = false, children }) => {
  const _children = children || "Log out";
  const handleClick = async () => {
    try {
      const arg = {};
      if (redirect != null) {
        arg.redirect = redirect;
      }
      callUserfront({
        method: "logout",
        args: [arg],
      });
    } catch (err) {
      // ...can this method even error, short of being disconnected or Userfront being down?
      console.warn(
        `Userfront.logout failed. Error: ${err.error}. Message: ${err.message}`
      );
    }
  };
  return (
    <button
      onClick={handleClick}
      className="userfront-toolkit userfront-element userfront-button userfront-button-logout"
      aria-disabled={disabled}
      disabled={disabled}
    >
      {_children}
    </button>
  );
};

export default LogoutButton;

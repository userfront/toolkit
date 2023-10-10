import { callUserfront } from "../services/userfront";

/**
 * A functioning logout button.
 *
 * @param {object} props
 * @param {boolean=} props.disabled - is the button disabled?
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

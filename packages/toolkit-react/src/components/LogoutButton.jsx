import { callUserfront } from "../services/userfront";

const LogoutButton = ({ redirect = true, disabled = false, children }) => {
  const _children = children || "Log out";
  const handleClick = async () => {
    try {
      callUserfront({
        method: "logout",
        args: [
          {
            redirect,
          },
        ],
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
      className="uf-toolkit uf-toolkit-element uf-toolkit-button uf-toolkit-button-logout"
      aria-disabled={disabled}
      disabled={disabled}
    >
      {_children}
    </button>
  );
};

export default LogoutButton;

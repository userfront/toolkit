import TestModeNotice from "./TestModeNotice";

const securedIcon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAuUlEQVR4Ab3MgQbCUBiG4TBACBCGIcAuYBi6hzCE0EWEMHQBAYYuYQgwwDCELiB0GWE4+HtxwH7nOGfRywMfvsU/ynDFGy/UWCO4Ai0MZGLEDTmcrTBAAt2RQNVAItVQ9ZBI/dyjFtWvRy0S7OOP9MkOZrKrOoi1xeA9ARqoLhCrxBK18wQ4QlVArA9KkPPEIAXpnpOzXp8AaOGsgAQYkcHbCeKDCkGdHQcGB0RV4gGxOuSY3QYpvH0BsMWaAAsRtG8AAAAASUVORK5CYII=";

const SecuredByUserfront = () => {
  return (
    <>
      <a
        className="uf-toolkit-secured"
        href="https://www.userfront.com"
        target="_blank"
        rel="noopener"
      >
        <img src={securedIcon} className="uf-toolkit-secured-icon" />
        Secured by Userfront
      </a>
      <TestModeNotice />
    </>
  );
};

export default SecuredByUserfront;

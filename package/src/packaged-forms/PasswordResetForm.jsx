import PackagedUniversalForm from "./UniversalForm";

/**
 * A fully functional Userfront password reset form. Allows requesting a password
 * reset for logged-out users, and setting a new password for users following a
 * reset link or for logged-in users.
 *
 * @param {object} props
 * @param {string=} props.tenantId - the tenant ID to use
 * @param {(string|boolean)=} props.redirect - URL to redirect to after successful login.
 *   If false, do not redirect.
 *   If absent, use the after-login path from the server.
 * @param {boolean=} props.xstateDevTools - if true, enable XState dev tools on the form's model.
 *   Defaults to false; should remain false in production.
 *   Only useful when developing this library.
 */
function PackagedPasswordResetForm(props) {
  return <PackagedUniversalForm type="reset" {...props} />;
}

export default PackagedPasswordResetForm;

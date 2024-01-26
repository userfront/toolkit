import PackagedUniversalForm from "./UniversalForm";

/**
 * A fully functional Userfront password reset form. Allows requesting a password
 * reset for logged-out users, and setting a new password for users following a
 * reset link or for logged-in users.
 *
 * @param {object} props
 * @param {string=} props.tenantId - the tenant ID to use
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

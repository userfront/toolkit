"use client";

import LoginForm from "../forms/LoginForm";
import createLoginFormMachine, {
  defaultAuthContext,
} from "../models/forms/login";
import { useMachine } from "@xstate/react";
import PackagedUniversalForm from "./UniversalForm";

/**
 * A fully functional Userfront login form
 *
 * @param {object} props
 * @param {string} props.tenantId - the tenant ID to use
 * @param {object} props.flow - auth flow to use. By default this is fetched from the server.
 * @param {boolean} props.compact - if true, for the password method, show a "Username and password" button.
 *   If false, show the password entry form alongside the buttons to choose a different factor.
 * @param {string | boolean} props.redirect - URL to redirect to after successful login.
 *   If false, do not redirect.
 *   If absent, use the after-login path from the server.
 * @param {boolean} props.redirectOnLoadIfLoggedIn - if true, will redirect to the after-signup path on page load
 *     if the user is already logged in
 *   If false, will not redirect on page load.
 *   Defaults to false.
 *   Does not control whether user is redirected after signing up. @see props.redirect
 * @param {boolean} props.shouldFetchFlow - if true (default), fetch the first factors from the server.
 *   If false, do not fetch the first factors from the server.
 *   Should be left at true in most production use cases.
 *   May be useful in some dev environments.
 * @param {boolean} props.xstateDevTools - if true, enable XState dev tools on the form's model.
 *   Defaults to false; should remain false in production.
 *   Only useful when developing this library.
 */
// function PackagedLoginForm({
//   tenantId,
//   flow,
//   compact,
//   redirect,
//   redirectOnLoadIfLoggedIn = false,
//   shouldFetchFlow = true,
//   xstateDevTools = false,
// }) {
//   const [state, send] = useMachine(
//     () => {
//       const config = {
//         ...defaultAuthContext.config,
//       };
//       if (tenantId) {
//         config.tenantId = tenantId;
//       }
//       if (flow) {
//         config.flow = flow;
//       }
//       config.compact = !!compact;
//       config.shouldFetchFlow = !!shouldFetchFlow;
//       config.redirect = redirect;
//       config.redirectOnLoad = !!redirectOnLoadIfLoggedIn;
//       const context = {
//         ...defaultAuthContext,
//         config,
//       };
//       return createLoginFormMachine(context);
//     },
//     { devTools: xstateDevTools }
//   );

//   return <LoginForm state={state} onEvent={send} />;
// }
function PackagedLoginForm(props) {
  return <PackagedUniversalForm type="login" {...props} />;
}

export default PackagedLoginForm;

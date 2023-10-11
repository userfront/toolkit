"use client";

import UniversalForm from "../forms/UniversalForm";
import createUniversalMachine, {
  defaultAuthContext,
} from "../models/forms/universal";
import { useMachine } from "@xstate/react";

/**
 * A fully functional Userfront combined auth form, capable of performing
 * signup, login, requesting password reset, and setting a new password.
 *
 * @param {object} props
 * @param {string=} props.type - the form type: "signup", "login", "reset"
 * @param {string=} props.tenantId - the tenant ID to use
 * @param {object=} props.flow - auth flow to use. By default this is fetched from the server.
 * @param {boolean=} props.compact - if true, for the password method, show a "Username and password" button.
 *   If false, show the password entry form alongside the buttons to choose a different factor.
 * @param {(string|boolean)=} props.redirect - URL to redirect to after successful login.
 *   If false, do not redirect.
 *   If absent, use the after-login path from the server.
 * @param {boolean=} props.redirectOnLoadIfLoggedIn - if true, will redirect to the after-signup path on page load
 *     if the user is already logged in
 *   If false, will not redirect on page load.
 *   Defaults to false.
 *   Does not control whether user is redirected after signing up.
 * @param {boolean=} props.shouldFetchFlow - if true (default), fetch the first factors from the server.
 *   If false, do not fetch the first factors from the server.
 *   Should be left at true in most production use cases.
 *   May be useful in some dev environments.
 * @param {boolean=} props.xstateDevTools - if true, enable XState dev tools on the form's model.
 *   Defaults to false; should remain false in production.
 *   Only useful when developing this library.
 */
function PackagedUniversalForm({
  type,
  tenantId,
  flow,
  compact,
  redirect,
  redirectOnLoadIfLoggedIn = false,
  shouldFetchFlow = true,
  xstateDevTools = false,
}) {
  const [state, send] = useMachine(
    () => {
      const config = {
        ...defaultAuthContext.config,
      };
      if (tenantId) {
        config.tenantId = tenantId;
      }
      if (flow) {
        config.flow = flow;
      }
      if (type) {
        config.type = type;
      }
      config.compact = !!compact;
      config.shouldFetchFlow = !!shouldFetchFlow;
      config.redirect = redirect;
      config.redirectOnLoad = !!redirectOnLoadIfLoggedIn;
      const context = {
        ...defaultAuthContext,
        config,
      };
      return createUniversalMachine(context);
    },
    { devTools: xstateDevTools }
  );

  return <UniversalForm state={state} onEvent={send} />;
}

export default PackagedUniversalForm;

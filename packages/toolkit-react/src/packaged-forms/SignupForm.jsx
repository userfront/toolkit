"use client";

import SignupForm from "../forms/SignupForm";
import createSignupFormMachine, {
  defaultAuthContext,
} from "../models/forms/signup";
import { useMachine } from "@xstate/react";

/**
 * A fully functional Userfront signup form
 *
 * @param {object} props
 * @param {string} props.tenantId - the tenant ID to use
 * @param {object} props.flow - auth flow to use. By default this is fetched from the server.
 * @param {boolean} props.compact - if true, for the password method, show a "Username and password" button.
 *   If false, show the password entry form alongside the buttons to choose a different factor.
 * @param {string | boolean} props.redirect - URL to redirect to after successful signup.
 *   If false, do not redirect.
 *   If absent, use the after-signup path from the server.
 * @param {boolean} props.shouldFetchFlow - if true (default), fetch the first factors from the server.
 *   If false, do not fetch the first factors from the server.
 *   Should be left at true in most production use cases.
 *   May be useful in some dev environments.
 * @param {boolean} props.xstateDevTools - if true, enable XState dev tools on the form's model.
 *   Defaults to false; should remain false in production.
 *   Only useful when developing this library.
 */
function PackagedSignupForm({
  tenantId,
  flow,
  compact,
  redirect,
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
      config.compact = !!compact;
      config.shouldFetchFlow = !!shouldFetchFlow;
      config.redirect = redirect;
      const context = {
        ...defaultAuthContext,
        config,
      };
      return createSignupFormMachine(context);
    },
    { devTools: xstateDevTools }
  );

  return <SignupForm state={state} onEvent={send} />;
}

export default PackagedSignupForm;

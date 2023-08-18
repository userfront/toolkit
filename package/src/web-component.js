import r2wc from "@r2wc/react-to-web-component";

import Userfront from "@userfront/core";

import SignupForm from "./packaged-forms/SignupForm";
import LoginForm from "./packaged-forms/LoginForm";
import PasswordResetForm from "./packaged-forms/PasswordResetForm";
import LogoutButton from "./components/LogoutButton";

import "./themes/default.css";

if (typeof window === "object" && !window.Userfront) {
  window.Userfront = Userfront;
}

/* Define the <foo-form> custom elements */
customElements.define(
  "signup-form",
  r2wc(SignupForm, {
    props: {
      tenantId: "string",
      flow: "json",
      compact: "boolean",
      redirect: "string",
      redirectOnLoadIfLoggedIn: "boolean",
      shouldFetchFlow: "boolean",
      xstateDevTools: "boolean",
    },
  })
);

customElements.define(
  "login-form",
  r2wc(LoginForm, {
    props: {
      tenantId: "string",
      flow: "json",
      compact: "boolean",
      redirect: "string",
      redirectOnLoadIfLoggedIn: "boolean",
      shouldFetchFlow: "boolean",
      xstateDevTools: "boolean",
    },
  })
);

customElements.define(
  "password-reset-form",
  r2wc(PasswordResetForm, {
    props: {
      tenantId: "string",
      flow: "json",
      compact: "boolean",
      redirect: "string",
      redirectOnLoadIfLoggedIn: "boolean",
      shouldFetchFlow: "boolean",
      xstateDevTools: "boolean",
    },
  })
);

customElements.define(
  "logout-button",
  r2wc(LogoutButton, {
    props: {
      disabled: "boolean",
      redirect: "string",
    },
  })
);

/* Define the <userfront-foo-form> custom elements as fallbacks in case of conflict */
customElements.define(
  "userfront-signup-form",
  r2wc(SignupForm, {
    props: {
      tenantId: "string",
      flow: "json",
      compact: "boolean",
      redirect: "string",
      redirectOnLoadIfLoggedIn: "boolean",
      shouldFetchFlow: "boolean",
      xstateDevTools: "boolean",
    },
  })
);

customElements.define(
  "userfront-login-form",
  r2wc(LoginForm, {
    props: {
      tenantId: "string",
      flow: "json",
      compact: "boolean",
      redirect: "string",
      redirectOnLoadIfLoggedIn: "boolean",
      shouldFetchFlow: "boolean",
      xstateDevTools: "boolean",
    },
  })
);

customElements.define(
  "userfront-password-reset-form",
  r2wc(PasswordResetForm, {
    props: {
      tenantId: "string",
      flow: "json",
      compact: "boolean",
      redirect: "string",
      redirectOnLoadIfLoggedIn: "boolean",
      shouldFetchFlow: "boolean",
      xstateDevTools: "boolean",
    },
  })
);

customElements.define(
  "userfront-logout-button",
  r2wc(LogoutButton, {
    props: {
      disabled: "boolean",
      redirect: "string",
    },
  })
);

export default Userfront;

# Userfront Toolkit

## Toolkit installation and usage

For more information and examples, visit the Userfront Toolkit home page: https://userfront.com/dashboard/toolkit

To install and use the Userfront Toolkit, follow the instructions for your framework or platform:

### React

Use Userfront React instead: [https://github.com/userfront/userfront/tree/main/packages/react](https://github.com/userfront/userfront/tree/main/packages/react)

### Vue

**Install:** `npm install --save @userfront/toolkit`

**Use:**

```js
<template>
  <div id="app">
    <signup-form />
  </div>
</template>

<script setup>
import Userfront from "@userfront/toolkit/vue";

Userfront.init("8b68vwdb");
</script>

<style>
...
</style>
```

### Without framework

**Install:** `npm install --save @userfront/toolkit`

**Use:**

```html
<html>
  <head>
    <script
      defer
      src="https://cdn.userfront.com/@userfront/toolkit@latest/dist/web-component.umd.js"
    ></script>
  </head>
  <body>
    <signup-form tenant-id="8b68vwdb"></signup-form>
  </body>
</html>
```

_or_

If bundling, or if you want to use the npm library rather than a script, run this on page load:

```js
import Userfront from "@userfront/toolkit/web-components";

Userfront.init("myTenantId");

// Now Toolkit components are registered as Web Components
```

```html
<body>
  <signup-form></signup-form>
</body>
```

## Components

| React                   | Vue & Web Components                          |
| ----------------------- | --------------------------------------------- |
| `<SignupForm />`        | `<signup-form></signup-form>`                 |
| `<LoginForm />`         | `<login-form></login-form>`                   |
| `<PasswordResetForm />` | `<password-reset-form></password-reset-form>` |
| `<LogoutButton />`      | `<logout-button></logout-button>`             |

**Note**: when using them in plain HTML, Web Components are not self-closing and must have the full closing tag.
When using in Vue, they can be written in self-closing form: `<signup-form />`.

The Vue components are `<kebab-case>` because they are Web Components under the hood, and Web Components are required to be in kebab-case.

### Props

In React, props are `camelCase`. In Vue and Web Components, props are `kebab-case`, as required by the Web Components standard.

All props are optional.

- `tenantId` / `tenant-id`: your workspace ID
  - This prop is not necessary if you call `Userfront.init("workspace_id")` before using the components.
  - Your workspace ID can be found on the [**Overview** page in your Userfront dashboard](https://userfront.com/dashboard).
- `compact`:
  - Default: `false`
  - `true`: hide the email & password inputs in favor of a "Username and password" button. Clicking this button will display the necessary inputs.
    - **Note**: The **Password** factor must be an enabled factor in your workspace's authentication flow configured on the [**Authentication** page in your Userfront dashboard](https://userfront.com/dashboard/authentication).
  - `false`: show the username and password fields directly in the form's sign-on method selection view.
- `redirect`: controls if and where the form should redirect **after** sign-on.
  - Default: `undefined`
  - `false`: the form does not redirect.
    - If set to a path, redirect to that path.
    - If empty, redirect to the path configured on the [**Paths & routing** page in your Userfront dashboard](https://userfront.com/dashboard/paths).
- `redirectOnLoadIfLoggedIn` / `redirect-on-load-if-logged-in`:
  - Default: `false`
  - `true`: redirects per the `redirect` parameter if the user is already logged in when the form is loaded.
  - `false`: do not redirect if the user is already logged in when the form is loaded.

## Development

### Repo structure

This repo holds several different libraries.

- `(root)` - you are here
  - `/.github/workflows` - CI/CD scripts.
  - `/package` - source for the npm package
  - `/site` - standalone dev/test app for all libraries.

The repo is configured as an npm workspace to enable sharing of libraries and dynamically linking the package to the dev app.

### Development installation and setup

1. Clone this repo.
2. Install:
   - `npm install`
3. Run dev servers:
   - `npm run dev`
   - This will run the live dev servers for both the package and the site.
4. Run unit test:
   - `npm run test`
5. Run Storybook:
   - `npm run storybook -w package`
   - Find the link to the local Storybook server in the output.
     - Storybook should hot reload on changes to the package. Each UI state has its own component, so changes should show immediately and shouldn't require reloading the page.

### Architecture

See the `README.md` in `packages/toolkit-react` for a more detailed overview of the toolkit's architecture.

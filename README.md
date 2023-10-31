# Userfront Toolkit

## Toolkit installation and usage

To install and use the Userfront Toolkit, follow the instructions for your framework or platform:

### React

**Install:** `npm install --save @userfront/toolkit`

**Use:**

```js
import Userfront, { SignupForm } from "@userfront/toolkit/react";

Userfront.init("myTenantId");

export default function MyComponent() {
  return <SignupForm />;
}
```

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

## Development

## Repo structure

This repo holds several different libraries.

- `(root)` - you are here
  - `/.github/workflows` - CI/CD scripts.
  - `/package` - source for the npm package
  - `/site` - standalone dev/test app for all libraries.

The repo is configured as an npm workspace to enable sharing of libraries and dynamically linking the package to the dev app.

## Development installation and setup

1. Clone this repo.
2. Install:

- `npm install`

4. Run dev servers:

- `npm run dev`

This will run the live dev servers for both the package and the site.

5. Run unit test:

- `npm run test`

6. Run Storybook:

- `npm run storybook -w package`
  - Find the link to the local Storybook server in the output.
  - Storybook should hot reload on changes to the package. Each UI state has its own component, so changes should show immediately and shouldn't require reloading the page.

## Architecture

See the `README.md` in `packages/toolkit-react` for a more detailed overview of the toolkit's architecture.

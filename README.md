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

_or_

```js
// MyComponent.js
import { SignupForm } from "@userfront/toolkit/react";

export default function MyComponent() {
  return <SignupForm tenantId="myTenantId" />;
}
```

### Vue

**Install:** `npm install --save @userfront/toolkit`

**Use:**

Import the Userfront Toolkit for Vue and initialize Userfront. The forms are automatically available anywhere in your Vue app.

```js
<template>
  <div id="app">
    <signup-form />
  </div>
</template>

<script setup>
import Userfront from "@userfront/toolkit/vue";

Userfront.init("d8b6gnwz");
</script>

<style>
...
</style>
```

### In an HTML page (via CDN)

**Use:**

```js
<html>
  <head>
    <script
      defer
      src="https://cdn.userfront.com/@userfront/toolkit/dist/web-component.umd.js"
    ></script>
  </head>
  <body>
    <signup-form tenantId="d8b6gnwz"></signup-form>
  </body>
</html>
```

## Development

## Repo structure

This repo holds several different libraries.

- `(root)` - you are here
  - `/.github/workflows` - CI/CD scripts for all libraries.
  - `/package` - the `@userfront/toolkit` npm package
  - `/site` - the standalone dev/test site.
  - `/strings` - (TODO/FUTURE) localized strings for toolkit components

The repo is set up as an npm workspace.

## Development installation and setup

1. Clone this repo.
2. Install the package and site:

- In a new terminal, `npm install -ws`

3. Run dev servers:

- `npm run dev`

5. Run unit tests:

- `npm run test -w package`

6. Run Storybook:

- `npm run storybook -w package`

## Architecture

See the `README.md` in `package` for a more detailed overview of the toolkit's architecture.

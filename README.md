# Userfront Toolkit

## Toolkit installation and usage

To install and use the Userfront Toolkit, follow the instructions for your framework or platform:

### React

**Install:** `npm install --save @userfront/react`

**Use:**

```js
import Userfront, { SignupForm } from "@userfront/react";

Userfront.init("myTenantId");

export default function MyComponent() {
  return <SignupForm />;
}
```

_or_

```js
// App.js
import { UserfrontContext } from "@userfront/react"

export default function App() {
  return (
    <UserfrontContext tenantId="myTenantId">
      <Component>
    </UserfrontContext>
  )
}
```

```js
// MyComponent.js
import { SignupForm } from "@userfront/react";

export default function MyComponent() {
  return <SignupForm />;
}
```

### Vue

**Install:** `npm install --save @userfront/vue`

**Use:** (TODO)

### Without framework

**Install:** `npm install --save @userfront/html`

**Use:** (TODO)

## Development

## Repo structure

This repo holds several different libraries.

- `(root)` - you are here
  - `/.github/workflows` - CI/CD scripts for all libraries.
  - `/packages` - npm packages
    - `/toolkit-react` - the `@userfront/react` toolkit. This is the primary library at the moment - the other libraries depend on this one for the form UI and logic.
      - `/.storybook` - Storybook stories for the UI components, deployed to (TODO public link)
    - `/toolkit-html` - the `@userfront/html` toolkit.
    - `/toolkit-vue` - the `@userfront/vue` toolkit.
  - `/sites` - standalone dev/test sites for all libraries.
    - `/toolkit-react` - standalone dev/test site for `@userfront/react`
    - `/toolkit-html` - standalone dev/test site for `@userfront/html`
    - `/toolkit-vue` - standalone dev/test site for `@userfront/vue`
  - `/strings` - (TODO/FUTURE) localized strings for toolkit components

## Development installation and setup

1. Clone this repo.
2. Install the packages:

- In a new terminal, `cd packages/toolkit-react` and `npm install`

3. Install dev/test apps:

- In a new terminal, `cd sites/toolkit-react` and `npm install`

4. Run dev servers:

- In the `packages/toolkit-react` terminal, `npm run dev`
- In the `sites/toolkit-react` terminal, `npm run dev`
  - Find the link to the local dev site in the output.
  - Dev site should hot reload on changes to the package or the site. Note that any flow must be restarted after changes - refresh the page to go back to the beginning.

5. Run unit tests:

- In the `packages/toolkit-react` terminal, `npm run test`

6. Run Storybook:

- In the `packages/toolkit-react` terminal, `npm run storybook`
  - Find the link to the local Storybook server in the output.
  - Storybook should hot reload on changes to the package. Each UI state has its own component, so changes should show immediately and shouldn't require reloading the page.

## Architecture

See the `README.md` in `packages/toolkit-react` for a more detailed overview of the toolkit's architecture.

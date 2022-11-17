import "../src/themes/default.css";

import { withCssVariables } from "./decorators/css-variables"

import * as jest from "jest-mock";
window.jest = jest;

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    // matchers: {
    //   color: /(background|color)$/i,
    //   date: /Date$/,
    // },
  },
}

// export const globalTypes = {

// }

export const decorators = [ withCssVariables ]
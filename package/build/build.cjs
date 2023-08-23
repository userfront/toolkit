const path = require("path");
const vite = require("vite");
const react = require("@vitejs/plugin-react");
const dts = require("vite-plugin-dts");
const cssInjectedByJsPlugin = require("vite-plugin-css-injected-by-js").default;

const resolve = path.resolve;
const build = vite.build;

/*
  Build ESM and UMD separately, so each can use idiomatic imports.
  For ESM, we want to mix default and named exports, so we can use the library like:
    import Userfront, { SignupForm } from "@userfront/react"
  For UMD/CJS, we can't mix default and named exports, so we attach the named
  exports to the default Userfront export, and the library is used like:
    const Userfront = require("@userfront/react");
    const SignupForm = Userfront.SignupForm;

    // or, if the Userfront singleton isn't needed in this file
    const SignupForm = require("@userfront/react").SignupForm;
*/

/*
  Options that are shared by both builds.
*/
const defaultOptions = {
  resolve: {
    alias: {
      "@": resolve(__dirname, "../src"),
      "@test": resolve(__dirname, "../test"),
    },
  },
};

const rollupOptions = {
  external: ["react", "react-dom"],
  output: {
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
    },
  },
};

/*
  Build-specific options.
*/

/* ESM build config */

const esmPlugins = [
  react(),
  dts({
    insertTypesEntry: true,
  }),
  cssInjectedByJsPlugin()
];

const esmOptions = {
  ...defaultOptions,
  plugins: esmPlugins,
  build: {
    define: {
      "import.meta.vitest": false
    },
    lib: {
      entry: resolve(__dirname, "../src/index.js"),
      formats: ["es"],
      fileName: "react"
    },
    rollupOptions,
    emptyOutDir: false
  }
};

/* UMD (CommonJS and bundle) build config */

// The dts (.d.ts file generation) plugin throws if it's
// run with the UMD build
const umdPlugins = [
  react(),
  cssInjectedByJsPlugin()
];

const umdOptions = {
  ...defaultOptions,
  plugins: umdPlugins,
  build: {
    define: {
      "import.meta.vitest": false
    },
    lib: {
      entry: resolve(__dirname, "../src/index-cjs.js"),
      formats: ["umd"],
      fileName: "react",
      name: "Userfront"
    },
    rollupOptions,
    emptyOutDir: false
  }
};

/* Web Components */

const webComponentPlugins = [
  react(),
  cssInjectedByJsPlugin()
];

const webComponentOptions = {
  ...defaultOptions,
  plugins: webComponentPlugins,
  define: {
    "process.env.NODE_ENV": "\"production\""
  },
  build: {
    lib: {
      entry: resolve(__dirname, "../src/web-component.js"),
      formats: ["es", "umd"],
      fileName: (format) => `web-component.${format}.js`,
      name: "web-component"
    },
    emptyOutDir: false,
    sourcemap: process.env.NODE_ENV === "production" ? false : true
  }
}

async function perform() {
  await build(esmOptions);
  await build(umdOptions);
  await build(webComponentOptions);
};

perform();

import { DemoForm } from "@userfront/toolkit/react";

function DemoSignupForm() {
  const demoTheme = {
    colors: {
      light: "#ffffff",
      dark: "#5e72e4",
      accent: "#13a0ff",
    },
    fontFamily: "Courier New, Consolas, monospace",
    extras: {
      fun: true,
      rounded: true,
    },
  };

  return (
    <>
      <h1>Demo signup form</h1>
      <div>
        <DemoForm type="signup" theme={demoTheme} />
      </div>
    </>
  );
}

export default DemoSignupForm;

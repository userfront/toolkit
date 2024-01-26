import { DemoForm } from "@userfront/toolkit/react";
import { useState } from "react";

const value = (setter) => (event) => setter(event.target.value);
const checked = (setter) => (event) => setter(event.target.checked);

function DemoSignupForm() {
  const [lightColor, setLightColor] = useState("rgba(255,255,255,1)");
  const [darkColor, setDarkColor] = useState("#5e72e4");
  const [accentColor, setAccentColor] = useState("#13a0ff");
  const [colorScheme, setColorScheme] = useState("light");
  const [fontFamily, setFontFamily] = useState(
    "Avenir, Helvetica, Arial, sans-serif"
  );
  const [size, setSize] = useState("default");
  const [isRounded, setIsRounded] = useState(false);
  const [isSquared, setIsSquared] = useState(false);
  const [hasGradientButtons, setHasGradientButtons] = useState(false);
  const [hideSecuredMessage, setHideSecuredMessage] = useState(false);
  const [hasRaisedButtons, setHasRaisedButtons] = useState(false);
  const [hasDottedOutlines, setHasDottedOutlines] = useState(false);

  const theme = {
    colors: {
      light: lightColor,
      dark: darkColor,
      accent: accentColor,
      lightBackground: "#f7fefc",
    },
    colorScheme,
    fontFamily,
    size,
    extras: {
      rounded: isRounded,
      squared: isSquared,
      gradientButtons: hasGradientButtons,
      hideSecuredMessage,
      raisedButtons: hasRaisedButtons,
      dottedOutlines: hasDottedOutlines,
    },
  };

  return (
    <>
      <h1>Demo signup form</h1>
      <div>
        <DemoForm type="signup" theme={theme} />
      </div>
      <hr />
      <h2>Theme setup</h2>
      <label htmlFor="lightColor">Light color</label>
      <input
        name="lightColor"
        type="color"
        value={lightColor}
        onChange={value(setLightColor)}
      />
      <label htmlFor="darkColor">Dark color</label>
      <input
        name="darkColor"
        type="color"
        value={darkColor}
        onChange={value(setDarkColor)}
      />
      <label htmlFor="accentColor">Accent color</label>
      <input
        name="accentColor"
        type="color"
        value={accentColor}
        onChange={value(setAccentColor)}
      />
      <label htmlFor="colorScheme">Color scheme (light, dark, auto)</label>
      <input
        name="colorScheme"
        type="text"
        value={colorScheme}
        onChange={value(setColorScheme)}
      />
      <label htmlFor="fontFamily">Font family</label>
      <input
        name="fontFamily"
        type="text"
        value={fontFamily}
        onChange={value(setFontFamily)}
      />
      <label htmlFor="size">Size</label>
      <input name="size" type="text" value={size} onChange={value(setSize)} />
      <h3>Extras</h3>
      <label htmlFor="isRounded">rounded</label>
      <input
        name="isRounded"
        type="checkbox"
        checked={isRounded}
        onChange={checked(setIsRounded)}
      />
      <label htmlFor="isSquared">squared</label>
      <input
        name="isSquared"
        type="checkbox"
        checked={isSquared}
        onChange={checked(setIsSquared)}
      />
      <label htmlFor="hasGradientButtons">gradientButtons</label>
      <input
        name="hasGradientButtons"
        type="checkbox"
        checked={hasGradientButtons}
        onChange={checked(setHasGradientButtons)}
      />
      <label htmlFor="hideSecuredMessage">hideSecuredMessage</label>
      <input
        name="hideSecuredMessage"
        type="checkbox"
        checked={hideSecuredMessage}
        onChange={checked(setHideSecuredMessage)}
      />
      <label htmlFor="hasRaisedButtons">raisedButtons</label>
      <input
        name="hasRaisedButtons"
        type="checkbox"
        checked={hasRaisedButtons}
        onChange={checked(setHasRaisedButtons)}
      />
      <label htmlFor="hasDottedOutlines">dottedOutlines</label>
      <input
        name="hasDottedOutlines"
        type="checkbox"
        checked={hasDottedOutlines}
        onChange={checked(setHasDottedOutlines)}
      />
    </>
  );
}

export default DemoSignupForm;

import { DemoForm } from "@userfront/toolkit/react";
import { useState } from "react";

const value = (setter) => (event) => setter(event.target.value);
const checked = (setter) => (event) => setter(event.target.checked);

function DemoSignupForm() {
  const [lightColor, setLightColor] = useState("rgba(255,255,255,1)");
  const [darkColor, setDarkColor] = useState("#5e72e4");
  const [accentColor, setAccentColor] = useState("#13a0ff");
  const [lightBackgroundColor, setLightBackgroundColor] = useState(undefined);
  const [darkBackgroundColor, setDarkBackgroundColor] = useState(undefined);
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
      lightBackground: lightBackgroundColor,
      darkBackground: darkBackgroundColor,
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
      <div>
        <label htmlFor="lightColor">Light color</label>
        <input
          name="lightColor"
          type="color"
          value={lightColor}
          onChange={value(setLightColor)}
        />
      </div>
      <div>
        <label htmlFor="darkColor">Dark color</label>
        <input
          name="darkColor"
          type="color"
          value={darkColor}
          onChange={value(setDarkColor)}
        />
      </div>
      <div>
        <label htmlFor="accentColor">Accent color</label>
        <input
          name="accentColor"
          type="color"
          value={accentColor}
          onChange={value(setAccentColor)}
        />
      </div>
      <div>
        <label htmlFor="useLightBackgroundColor">
          Set light background color
        </label>
        <input
          name="useLightBackgroundColor"
          type="checkbox"
          checked={!!lightBackgroundColor}
          onChange={(evt) => {
            if (evt.target.checked) {
              setLightBackgroundColor("#ffffff");
            } else {
              setLightBackgroundColor(undefined);
            }
          }}
        />
        {lightBackgroundColor && (
          <div>
            <label htmlFor="lightBackgroundColor">Light background color</label>
            <input
              type="color"
              name="lightBackgroundColor"
              value={lightBackgroundColor}
              onChange={value(setLightBackgroundColor)}
            />
          </div>
        )}
      </div>
      <div>
        <label htmlFor="useDarkBackgroundColor">
          Set dark background color
        </label>
        <input
          name="useDarkBackgroundColor"
          type="checkbox"
          checked={!!darkBackgroundColor}
          onChange={(evt) => {
            if (evt.target.checked) {
              setDarkBackgroundColor("#2d2d2d");
            } else {
              setDarkBackgroundColor(undefined);
            }
          }}
        />
        {darkBackgroundColor && (
          <div>
            <label htmlFor="darkBackgroundColor">Dark background color</label>
            <input
              type="color"
              name="darkBackgroundColor"
              value={darkBackgroundColor}
              onChange={value(setDarkBackgroundColor)}
            />
          </div>
        )}
      </div>
      <div>
        <label htmlFor="colorScheme">Color scheme (light, dark, auto)</label>
        <input
          name="colorScheme"
          type="text"
          value={colorScheme}
          onChange={value(setColorScheme)}
        />
      </div>
      <div>
        <label htmlFor="fontFamily">Font family</label>
        <input
          name="fontFamily"
          type="text"
          value={fontFamily}
          onChange={value(setFontFamily)}
        />
      </div>
      <div>
        <label htmlFor="size">Size</label>
        <input name="size" type="text" value={size} onChange={value(setSize)} />
      </div>
      <h3>Extras</h3>
      <div>
        <label htmlFor="isRounded">rounded</label>
        <input
          name="isRounded"
          type="checkbox"
          checked={isRounded}
          onChange={checked(setIsRounded)}
        />
      </div>
      <div>
        <label htmlFor="isSquared">squared</label>
        <input
          name="isSquared"
          type="checkbox"
          checked={isSquared}
          onChange={checked(setIsSquared)}
        />
      </div>
      <div>
        <label htmlFor="hasGradientButtons">gradientButtons</label>
        <input
          name="hasGradientButtons"
          type="checkbox"
          checked={hasGradientButtons}
          onChange={checked(setHasGradientButtons)}
        />
      </div>
      <div>
        <label htmlFor="hideSecuredMessage">hideSecuredMessage</label>
        <input
          name="hideSecuredMessage"
          type="checkbox"
          checked={hideSecuredMessage}
          onChange={checked(setHideSecuredMessage)}
        />
      </div>
      <div>
        <label htmlFor="hasRaisedButtons">raisedButtons</label>
        <input
          name="hasRaisedButtons"
          type="checkbox"
          checked={hasRaisedButtons}
          onChange={checked(setHasRaisedButtons)}
        />
      </div>
      <div>
        <label htmlFor="hasDottedOutlines">dottedOutlines</label>
        <input
          name="hasDottedOutlines"
          type="checkbox"
          checked={hasDottedOutlines}
          onChange={checked(setHasDottedOutlines)}
        />
      </div>
    </>
  );
}

export default DemoSignupForm;

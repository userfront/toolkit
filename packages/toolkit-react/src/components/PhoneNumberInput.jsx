import { useState } from "react";
import "react-phone-input-2/lib/style.css";

// Workaround for a Vite/Rollup issue where CJS module exports
// work in development mode but not in production mode (?!?)
// See https://github.com/vitejs/vite/issues/2139#issuecomment-1173976668

import RPI from "react-phone-input-2";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const PhoneInput = RPI.default ?? RPI;

const PhoneNumberInput = ({ ...props }) => {
  const [number, setNumber] = useState("");
  const handleChange = (value, country, e, formattedValue) => {
    setNumber(`+${value}`);
  };
  return (
    <>
      <PhoneInput country="us" value={number} onChange={handleChange} />
      <input type="hidden" value={number} {...props} />
    </>
  );
};

export default PhoneNumberInput;

import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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

export default PhoneNumberInput;
/**
 * A phone number input, using react-phone-input-2
 * Has country code dropdown selector and automatic formatting.
 * Value is the phone number in E.164 format.
 * Props are passed through to a hidden <input> whose value changes
 * when the visible input's value changes.
 *
 * @param {object} props
 * @returns
 */
declare function PhoneNumberInput({
  ...props
}: object): import("react").JSX.Element;

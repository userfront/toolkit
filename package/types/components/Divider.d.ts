export default Divider;
/**
 * A horizontal divider, optionally containing some text.
 * If without text, a solid line.
 * If with text, two solid lines with the text in the middle:
 *   ---- text ----
 *
 * @param {object} props
 * @param {string} props.text
 * @returns
 */
declare function Divider({
  text,
}: {
  text: string;
}): import("react").JSX.Element;

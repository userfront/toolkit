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
const Divider = ({ text }) => {
  if (text) {
    return (
      <div className="uf-toolkit-divider-split">
        <div className="uf-toolkit-divider" />
        <span className="uf-toolkit-divider-text">{text}</span>
        <div className="uf-toolkit-divider" />
      </div>
    );
  }
  return <div className="uf-toolkit-divider" />;
};

export default Divider;

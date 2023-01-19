/**
 * An <input> with appropriate classes.
 * Props are passed through to the underlying <input>
 *
 * @param {object} props
 * @returns
 */
const Input = ({ ...props }) => {
  return <input className="uf-toolkit-input" {...props} />;
};

export default Input;

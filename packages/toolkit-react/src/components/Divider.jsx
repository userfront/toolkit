const Divider = ({ text }) => {
  if (text) {
    return <div>--- {text} ---</div>;
  }
  return <div>------</div>;
};

export default Divider;

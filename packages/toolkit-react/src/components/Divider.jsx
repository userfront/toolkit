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

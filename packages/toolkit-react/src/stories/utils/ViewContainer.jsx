const Container = ({ sizeClass, title, children, style }) => {
  return (
    <div
      style={style}
      className={`uf-toolkit uf-toolkit-container ${sizeClass}`}
    >
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
};

export default Container;

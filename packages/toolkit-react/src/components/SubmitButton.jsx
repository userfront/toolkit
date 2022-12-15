const SubmitButton = (props) => {
  const children = props.children || "Submit";
  return (
    <button
      className="uf-toolkit-button uf-toolkit-button-primary"
      type="submit"
      {...props}
    >
      {children}
    </button>
  );
};

export default SubmitButton;

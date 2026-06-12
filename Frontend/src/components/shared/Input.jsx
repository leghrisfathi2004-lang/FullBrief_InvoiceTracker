import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, name, type = "text", error, ...rest },
  ref
) {
  return (
    <div className="form-field">
      {label && <label htmlFor={name}>{label}</label>}
      <input ref={ref} id={name} name={name} type={type} {...rest} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
});

export default Input;

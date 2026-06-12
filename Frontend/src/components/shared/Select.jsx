import { forwardRef } from "react";

const Select = forwardRef(function Select(
  { label, name, options = [], error, placeholder, ...rest },
  ref
) {
  return (
    <div className="form-field">
      {label && <label htmlFor={name}>{label}</label>}
      <select ref={ref} id={name} name={name} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
});

export default Select;

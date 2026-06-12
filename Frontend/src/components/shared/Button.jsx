export default function Button({
  variant = "primary",
  loading = false,
  disabled,
  type = "button",
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? "..." : children}
    </button>
  );
}

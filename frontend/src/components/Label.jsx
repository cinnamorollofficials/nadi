import PropTypes from "prop-types";

const Label = ({ children, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary-container text-on-secondary-container border-outline-variant/30",
    success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200/50 dark:border-green-900/50",
    error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200/50 dark:border-red-900/50",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/50",
    tonal: "bg-surface-variant/30 text-surface-on-variant border-outline-variant/30"
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

Label.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "success", "error", "warning", "tonal"]),
  className: PropTypes.string,
};

export default Label;

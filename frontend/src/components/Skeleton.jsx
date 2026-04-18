import PropTypes from "prop-types";

const Skeleton = ({ className, circle = false }) => {
  return (
    <div
      className={`relative overflow-hidden bg-slate-200 dark:bg-slate-800 animate-pulse ${
        circle ? "rounded-full" : "rounded-xl"
      } ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-shimmer" />
    </div>
  );
};

Skeleton.propTypes = {
  className: PropTypes.string,
  circle: PropTypes.bool,
};

export default Skeleton;

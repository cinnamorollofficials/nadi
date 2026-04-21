import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const Dropdown = ({ 
  trigger, 
  actions = [], 
  className = "", 
  align = "right",
  onOpenChange 
}) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, right: 0 });
  const btnRef = useRef(null);
  const dropRef = useRef(null);

  const openMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = btnRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    
    const newPos = {
      top: rect.bottom + scrollY + 4,
    };

    if (align === "right") {
      newPos.right = window.innerWidth - rect.right;
      newPos.left = "auto";
    } else {
      newPos.left = rect.left;
      newPos.right = "auto";
    }

    setPos(newPos);
    setOpen(true);
    onOpenChange?.(true);
  };

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (
        dropRef.current &&
        !dropRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
        onOpenChange?.(false);
      }
    };
    
    const reposition = () => {
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        const newPos = { top: rect.bottom + scrollY + 4 };
        if (align === "right") {
          newPos.right = window.innerWidth - rect.right;
          newPos.left = "auto";
        } else {
          newPos.left = rect.left;
          newPos.right = "auto";
        }
        setPos(newPos);
      }
    };

    document.addEventListener("mousedown", close);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, align, onOpenChange]);

  return (
    <div className={`relative inline-block ${className}`}>
      <div ref={btnRef} onClick={openMenu} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          ref={dropRef}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            right: pos.right,
            zIndex: 9999,
          }}
          className="min-w-[160px] bg-white dark:bg-navy-900 border border-outline-variant/30 rounded-2xl shadow-xl py-1.5 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
        >
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
                onOpenChange?.(false);
                action.onClick();
              }}
              className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all duration-200 hover:bg-primary/10 flex items-center gap-3 ${
                action.className || "text-surface-on-variant hover:text-primary"
              }`}
            >
              {action.icon && (
                <span className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                  {action.icon}
                </span>
              )}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  trigger: PropTypes.node.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string,
    })
  ).isRequired,
  className: PropTypes.string,
  align: PropTypes.oneOf(["left", "right"]),
  onOpenChange: PropTypes.func,
};

export default Dropdown;

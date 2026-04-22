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
    
    let newPos = {};
    if (align === "right-side") {
      newPos = {
        top: rect.top,
        left: rect.right + 12,
        right: "auto"
      };
    } else if (align === "right") {
      newPos = {
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
        left: "auto"
      };
    } else {
      newPos = {
        top: rect.bottom + 4,
        left: rect.left,
        right: "auto"
      };
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
        let newPos = {};
        if (align === "right-side") {
          newPos = {
            top: rect.top,
            left: rect.right + 12,
            right: "auto"
          };
        } else if (align === "right") {
          newPos = {
            top: rect.bottom + 4,
            right: window.innerWidth - rect.right,
            left: "auto"
          };
        } else {
          newPos = {
            top: rect.bottom + 4,
            left: rect.left,
            right: "auto"
          };
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
            zIndex: 999999,
          }}
          className="min-w-[180px] bg-white dark:bg-navy-900 border border-outline-variant/30 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in-95 slide-in-from-left-2 duration-200 overflow-hidden"
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
              className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all duration-200 hover:bg-surface-variant/50 flex items-center gap-3 ${
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
  align: PropTypes.oneOf(["left", "right", "right-side"]),
  onOpenChange: PropTypes.func,
};

export default Dropdown;

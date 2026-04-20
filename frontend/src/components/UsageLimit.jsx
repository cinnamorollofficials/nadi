import React from "react";
import { motion } from "framer-motion";

const UsageLimit = ({ used = 400, limit = 10000, percent = 4 }) => {
  // Determine color based on percentage
  let barColor = "bg-emerald-500";
  if (percent > 85) {
    barColor = "bg-rose-500";
  } else if (percent > 60) {
    barColor = "bg-amber-500";
  }

  return (
    <div className="px-4 py-3 mb-4 mx-3 bg-surface-container-high/40 rounded-2xl border border-outline-variant/10 group hover:border-primary/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-surface-on-variant uppercase tracking-wider">
          Token Terpakai
        </span>
        <span className="text-[10px] font-bold text-surface-on">
          {used.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>

      <div className="relative h-1.5 w-full bg-outline-variant/20 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`absolute top-0 left-0 h-full ${barColor} shadow-[0_0_8px_rgba(0,0,0,0.2)]`}
        />
      </div>

      {percent >= 100 && (
        <p className="text-[9px] text-rose-500 mt-1.5 leading-tight font-medium animate-pulse">
          Limit tercapai. Reset besok hari.
        </p>
      )}
    </div>
  );
};

export default UsageLimit;

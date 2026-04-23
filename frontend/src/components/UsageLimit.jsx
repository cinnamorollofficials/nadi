import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getMyUsage } from "../api/aiUsage";

const formatNumber = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
};

const UsageLimit = ({ used = 0, limit = 20, percent = 0 }) => {
  const [tokenUsage, setTokenUsage] = useState(null);

  useEffect(() => {
    getMyUsage(7)
      .then(setTokenUsage)
      .catch(() => setTokenUsage(null));
  }, []);

  // Determine bar color
  let barColor = "bg-emerald-500";
  if (percent > 85) barColor = "bg-rose-500";
  else if (percent > 60) barColor = "bg-amber-500";

  return (
    <div className="px-4 py-3 mb-4 mx-3 bg-surface-container-high/40 rounded-2xl border border-outline-variant/10 group hover:border-primary/20 transition-all duration-300 space-y-3">
      {/* Consultations */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-surface-on-variant uppercase tracking-wider">
            Konsultasi Hari Ini
          </span>
          <span className="text-[10px] font-bold text-surface-on">
            {used} / {limit}
          </span>
        </div>
        <div className="relative h-1.5 w-full bg-outline-variant/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percent, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`absolute top-0 left-0 h-full ${barColor}`}
          />
        </div>
        {percent >= 100 && (
          <p className="text-[9px] text-rose-500 mt-1 font-medium">
            Limit tercapai. Reset besok.
          </p>
        )}
      </div>

      {/* Actual Token Usage from Gemini */}
      {tokenUsage && (
        <div className="pt-2 border-t border-outline-variant/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-surface-on-variant uppercase tracking-wider">
              Token Hari Ini
            </span>
            <span className="text-[10px] font-bold text-primary">
              {formatNumber(tokenUsage.today?.total_tokens || 0)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-[9px] text-surface-on-variant/60">
              Est. biaya
            </span>
            <span className="text-[9px] text-surface-on-variant/60">
              ${(tokenUsage.today?.estimated_cost || 0).toFixed(5)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageLimit;

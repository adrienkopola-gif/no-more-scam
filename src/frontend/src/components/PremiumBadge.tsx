import { Crown } from "lucide-react";
import React from "react";

interface PremiumBadgeProps {
  className?: string;
}

export default function PremiumBadge({ className = "" }: PremiumBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold premium-badge-shine bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 ${className}`}
    >
      <Crown className="h-3 w-3" />
      Premium
    </span>
  );
}

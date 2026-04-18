// FILE: apps/web/components/PriceCalc.tsx
// Live price breakdown — recalculates whenever PrintConfig changes

"use client";

import type { PrintConfig } from "@/lib/types";
import { calculatePrice } from "@/lib/price";

interface Props {
  config: PrintConfig;
}

export default function PriceCalc({ config }: Props) {
  const { perPageCost, subtotal, total, breakdown } = calculatePrice(config);

  return (
    <div className="bg-[#1a1916] border border-[#2e2c28] rounded-xl p-4 mt-4">
      <h3 className="text-xs tracking-widest uppercase text-[#6b6860] mb-3">Price Estimate</h3>

      <div className="space-y-2 text-sm">
        {breakdown.map((line) => (
          <div key={line.label} className="flex justify-between text-[#a09c90]">
            <span>{line.label}</span>
            <span>₹{line.amount.toFixed(2)}</span>
          </div>
        ))}

        <div className="border-t border-[#2e2c28] pt-2 mt-2 flex justify-between font-bold text-[#f0ede6]">
          <span>Total</span>
          <span className="text-[#e8642a] text-base">₹{total.toFixed(2)}</span>
        </div>
      </div>

      <p className="text-[#3d3b36] text-xs mt-3">
        ₹{perPageCost}/page × {config.pages} pages × {config.copies} copies
        {config.colour ? " + colour surcharge" : ""}
      </p>
    </div>
  );
}
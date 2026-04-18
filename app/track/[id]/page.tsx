// FILE: apps/web/app/track/[id]/page.tsx
// Order tracking page — polls GET /orders/:id every 5s, auto-stops on completion

"use client";

import { useParams } from "next/navigation";
import OrderTracker from "@/components/OrderTracker";
import { usePolling } from "@/lib/usePolling";
import type { Order } from "@/lib/types";

export default function TrackPage() {
  const { id } = useParams<{ id: string }>();

  // Stop polling once order is completed or cancelled
  const { data: order, error } = usePolling<Order>(
    `/api/orders/${id}`,
    5000,
    (data) => data?.status === "completed" || data?.status === "cancelled"
  );

  return (
    <main className="min-h-screen bg-[#0f0e0c] text-[#f0ede6] px-5 py-10 font-['Space_Mono',monospace] max-w-lg mx-auto">
      <a href="/" className="text-[#6b6860] text-xs mb-8 inline-flex items-center gap-1 hover:text-[#e8642a] transition-colors">
        ← Home
      </a>

      <div className="mb-8">
        <p className="text-[#6b6860] text-xs tracking-widest uppercase mb-1">Order</p>
        <h2 className="text-2xl font-bold">{id}</h2>
      </div>

      {error ? (
        <div className="bg-red-900/20 border border-red-800/40 rounded-xl p-4 text-red-400 text-sm">
          Could not load order. Check your order ID and try again.
        </div>
      ) : !order ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-14 bg-[#1a1916] border border-[#2e2c28] rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <OrderTracker order={order} />
      )}
    </main>
  );
}
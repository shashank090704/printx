// FILE: apps/web/app/checkout/page.tsx
// Checkout page — choose online (Razorpay UPI) or offline (cash at shop)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PaymentToggle from "@/components/PaymentToggle";
import PriceCalc from "@/components/PriceCalc";
import { api }  from "@/lib/api";
import type { PrintConfig, PaymentMode } from "@/lib/types";

declare global {
  interface Window {
    // Razorpay SDK loaded via <Script> in layout
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("online");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [job, setJob] = useState<{
    cloudinaryUrl: string;
    config: PrintConfig;
    fileName: string;
  } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("printJob");
    if (!stored) { router.push("/upload"); return; }
    setJob(JSON.parse(stored));
  }, [router]);

  const handlePlaceOrder = async () => {
    if (!job) return;
    setLoading(true);
    setError("");

    try {
      if (paymentMode === "offline") {
        // Create order directly — no payment needed upfront
        const { orderId } = await api.createOrder({
          ...job.config,
          cloudinaryUrl: job.cloudinaryUrl,
          fileName: job.fileName,
          paymentMode: "offline",
        });
        sessionStorage.removeItem("printJob");
        router.push(`/track/${orderId}`);
      } else {
        // Online: create Razorpay order first, then open UPI popup
        const { orderId, razorpayOrderId, amount } = await api.createOrder({
          ...job.config,
          cloudinaryUrl: job.cloudinaryUrl,
          fileName: job.fileName,
          paymentMode: "online",
        });

        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount,
          currency: "INR",
          order_id: razorpayOrderId,
          name: "SmartPrint",
          description: `Print order — ${job.fileName}`,
          handler: () => {
            sessionStorage.removeItem("printJob");
            router.push(`/track/${orderId}`);
          },
          modal: { ondismiss: () => setLoading(false) },
        });
        rzp.open();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <main className="min-h-screen bg-[#0f0e0c] text-[#f0ede6] px-5 py-10 font-['Space_Mono',monospace] max-w-lg mx-auto">
      <a href="/upload" className="text-[#6b6860] text-xs mb-8 inline-flex items-center gap-1 hover:text-[#e8642a] transition-colors">
        ← Back
      </a>

      <h2 className="text-2xl font-bold mb-1">Checkout</h2>
      <p className="text-[#6b6860] text-xs mb-8">Choose how you'd like to pay</p>

      {/* File summary */}
      <div className="bg-[#1a1916] border border-[#2e2c28] rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#e8642a]/10 border border-[#e8642a]/20 rounded-lg flex items-center justify-center text-[#e8642a] text-xs font-bold">
            PDF
          </div>
          <div>
            <p className="text-sm font-bold truncate max-w-[220px]">{job.fileName}</p>
            <p className="text-[#6b6860] text-xs">
              {job.config.copies} cop{job.config.copies > 1 ? "ies" : "y"} ·{" "}
              {job.config.colour ? "Colour" : "B&W"} ·{" "}
              {job.config.duplex ? "Duplex" : "Single-sided"}
            </p>
          </div>
        </div>
      </div>

      {/* Payment mode toggle */}
      <PaymentToggle mode={paymentMode} onChange={setPaymentMode} />

      {/* Price */}
      <PriceCalc config={job.config} />

      {error && <p className="text-red-400 text-xs mt-3">{error}</p>}

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="w-full bg-[#e8642a] hover:bg-[#d4571f] disabled:opacity-50 text-white font-bold text-sm py-4 rounded-xl mt-6 transition-colors tracking-wide uppercase"
      >
        {loading
          ? "Processing…"
          : paymentMode === "online"
          ? "Pay Online via UPI →"
          : "Place Cash Order →"}
      </button>

      {paymentMode === "offline" && (
        <p className="text-[#6b6860] text-xs text-center mt-3">
          Pay cash when you collect your printout at the shop.
        </p>
      )}
    </main>
  );
}

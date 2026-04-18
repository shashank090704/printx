// FILE: apps/web/app/page.tsx
// Landing page — shows QR code + CTA to start print order

"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0f0e0c] text-[#f0ede6] flex flex-col items-center justify-center px-6 py-16 font-['Space_Mono',monospace]">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-[#1a1916] border border-[#2e2c28] rounded-full px-4 py-1.5 text-xs text-[#a09c90] mb-6 tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
          Shop is open
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-3 text-[#f0ede6]">
          Smart<span className="text-[#e8642a]">Print</span>
        </h1>
        <p className="text-[#6b6860] text-sm max-w-xs mx-auto leading-relaxed">
          Upload your file. Pick your options. We print it. Simple.
        </p>
      </div>

      {/* QR Code placeholder card */}
      <div className="bg-[#1a1916] border border-[#2e2c28] rounded-2xl p-8 mb-8 text-center w-full max-w-xs">
        <div className="w-48 h-48 bg-[#0f0e0c] border border-[#2e2c28] rounded-xl mx-auto mb-4 flex items-center justify-center">
          {/* QR placeholder — replace with actual <Image> or <QRCode> component */}
          <div className="grid grid-cols-3 gap-1 opacity-30">
            {[1,0.2,1,0.2,1,0.2,1,0.2,1].map((opacity, i) => (
  <div
    key={i}
    className="w-10 h-10 bg-[#f0ede6] rounded-sm"
    style={{ opacity }}
  />
))}
          </div>
        </div>
        <p className="text-[#6b6860] text-xs">Scan to open on your phone</p>
      </div>

      {/* CTA */}
      <Link
        href="/upload"
        className="w-full max-w-xs bg-[#e8642a] hover:bg-[#d4571f] text-white font-bold text-sm py-4 rounded-xl text-center transition-colors tracking-wide uppercase"
      >
        Start New Print Order →
      </Link>

      <p className="mt-6 text-[#3d3b36] text-xs">Track existing order? Enter order ID below</p>

      <div className="mt-3 flex gap-2 w-full max-w-xs">
        <input
          type="text"
          placeholder="Order ID e.g. ABC123"
          className="flex-1 bg-[#1a1916] border border-[#2e2c28] rounded-lg px-4 py-2.5 text-sm text-[#f0ede6] placeholder:text-[#3d3b36] outline-none focus:border-[#e8642a] transition-colors"
        />
        <Link
          href="#"
          className="bg-[#1a1916] border border-[#2e2c28] hover:border-[#e8642a] rounded-lg px-4 py-2.5 text-sm text-[#a09c90] hover:text-[#e8642a] transition-colors"
        >
          Go
        </Link>
      </div>
    </main>
  );
}
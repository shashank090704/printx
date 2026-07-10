// FILE: apps/web/app/upload/page.tsx
// Upload page — drag & drop file + print options + live price

"use client";

import { useState, useCallback } from "react";
import { useRouter }  from "next/navigation";
import FileDropzone from "@/components/FileDropzone";
import PrintOptions from "@/components/PrintOptions";
import PriceCalc from "@/components/PriceCalc";
import { uploadToCloudinary } from "@/lib/upload";
import { api } from "@/lib/api";
import type { PrintConfig } from "@/lib/types";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [config, setConfig] = useState<PrintConfig>({
    pages: 1,
    copies: 1,
    colour: false,
    duplex: false,
  });
  const [error, setError] = useState("");

  const handleFileAccepted = useCallback(async (acceptedFile: File) => {
    setFile(acceptedFile);
    setUploading(true);
    setError("");
    try {
      // Get signed URL from backend, then upload directly to Cloudinary
      const { signature, timestamp, cloudName, apiKey, folder } =
        await api.getUploadSignature();
      const url = await uploadToCloudinary(acceptedFile, {
        signature,
        timestamp,
        cloudName,
        apiKey,
        folder,
      });
      setCloudinaryUrl(url);
    } catch {
      setError("Upload failed. Please try again.");
      setFile(null);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleNext = () => {
    if (!cloudinaryUrl) return;
    // Pass config + URL via sessionStorage to checkout page
    sessionStorage.setItem(
      "printJob",
      JSON.stringify({ cloudinaryUrl, config, fileName: file?.name })
    );
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-[#0f0e0c] text-[#f0ede6] px-5 py-10 font-['Space_Mono',monospace] max-w-lg mx-auto">
      {/* Back nav */}
      <a href="/" className="text-[#6b6860] text-xs mb-8 inline-flex items-center gap-1 hover:text-[#e8642a] transition-colors">
        ← Back
      </a>

      <h2 className="text-2xl font-bold mb-1">Upload your file</h2>
      <p className="text-[#6b6860] text-xs mb-8">PDF, DOCX, JPG, PNG — max 25 MB</p>

      {/* Dropzone */}
      <FileDropzone
        onFileAccepted={handleFileAccepted}
        file={file}
        uploading={uploading}
      />

      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}

      {/* Print options — only show once file is uploaded */}
      {cloudinaryUrl && (
        <>
          <PrintOptions config={config} onChange={setConfig} />
          <PriceCalc config={config} />

          <button
            onClick={handleNext}
            className="w-full bg-[#e8642a] hover:bg-[#d4571f] text-white font-bold text-sm py-4 rounded-xl mt-6 transition-colors tracking-wide uppercase"
          >
            Continue to Checkout →
          </button>
        </>
      )}
    </main>
  );
}

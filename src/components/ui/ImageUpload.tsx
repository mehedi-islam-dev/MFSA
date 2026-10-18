"use client";

/**
 * ImageUpload.tsx
 * ──────────────────────────────────────────────────────────────────────────────
 * A reusable Cloudinary upload widget component for Marine Analytica.
 *
 * ARCHITECTURE:
 *   Browser → Cloudinary (direct upload, unsigned preset)
 *           → returns secure_url
 *   Parent form stores secure_url as TEXT in Supabase row.
 *
 * USAGE EXAMPLE (inside a Supabase form):
 * ─────────────────────────────────────────
 *   const [imageUrl, setImageUrl] = useState("");
 *
 *   <ImageUpload
 *     onUpload={(url) => setImageUrl(url)}
 *     label="Fungal Micrograph"
 *   />
 *
 *   // Then on form submit, pass imageUrl to your Supabase insert:
 *   await supabase.from("samples").insert({ ...formData, image_url: imageUrl });
 * ─────────────────────────────────────────
 *
 * REQUIRED ENV VARS (in .env):
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=marine_analytica_uploads
 *
 * The upload preset MUST be set to "Unsigned" in Cloudinary dashboard:
 *   Settings → Upload → Upload presets → Add preset → Signing Mode: Unsigned
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { useState, useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  CheckCircle2,
  ImageIcon,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CloudinaryUploadResult {
  info: {
    secure_url: string;
    public_id: string;
    original_filename: string;
    format: string;
    bytes: number;
    width: number;
    height: number;
  };
}

interface ImageUploadProps {
  /** Called when Cloudinary returns a secure_url. Pass this URL to Supabase. */
  onUpload: (secureUrl: string) => void;
  /** Optional label shown above the upload zone */
  label?: string;
  /** Optional helper text shown inside the trigger */
  hint?: string;
  /** Optional current value — shows existing image on mount */
  value?: string;
  /** Whether the upload is disabled (e.g. while parent form is submitting) */
  disabled?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ImageUpload({
  onUpload,
  label = "Image Upload",
  hint = "Supports JPG, PNG, WebP — up to 10 MB",
  value,
  disabled = false,
}: ImageUploadProps) {
  const { data: session } = useSession();
  const [uploadedUrl, setUploadedUrl] = useState<string>(value ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // ── Guard: missing env vars ──────────────────────────────────────────────
  const missingConfig =
    !cloudName || cloudName === "your_cloud_name_here" || !uploadPreset;

  const handleSuccess = useCallback(
    (result: CloudinaryUploadResult) => {
      const url = result.info.secure_url;
      setUploadedUrl(url);
      setIsUploading(false);
      setError("");
      /**
       * ► Hand the URL to the parent form.
       *   Store this string in your Supabase table as a TEXT / VARCHAR column.
       *   Example column name: image_url
       */
      onUpload(url);
    },
    [onUpload]
  );

  const handleError = useCallback(() => {
    setIsUploading(false);
    setError("Upload failed. Please try again.");
  }, []);

  const handleClear = useCallback(() => {
    setUploadedUrl("");
    setError("");
    onUpload("");
  }, [onUpload]);

  // ── Config warning ────────────────────────────────────────────────────────
  if (missingConfig) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-300 tracking-wide">
            Cloudinary not configured
          </p>
          <p className="text-xs text-amber-500/80 mt-1 leading-relaxed">
            Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and
            NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label className="block text-xs font-bold text-[#00f0ff]/70 uppercase tracking-[0.2em]">
          {label}
        </label>
      )}

      <AnimatePresence mode="wait">
        {/* ── Preview state: image uploaded ── */}
        {uploadedUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="relative group rounded-xl overflow-hidden border border-[#00f0ff]/30 bg-[#010409]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={uploadedUrl}
              alt="Uploaded image preview"
              className="w-full max-h-52 object-cover"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[#010409]/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#00ff66] drop-shadow-[0_0_8px_rgba(0,255,102,0.8)]" />
              <span className="text-xs font-bold text-white tracking-widest uppercase">
                Uploaded to Cloudinary
              </span>
            </div>

            {/* Clear button */}
            {!disabled && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Remove uploaded image"
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#010409]/80 border border-[#00f0ff]/20 flex items-center justify-center text-slate-400 hover:text-[#ff003c] hover:border-[#ff003c]/50 transition-all opacity-0 group-hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* URL bar — shows where Supabase will store this value */}
            <div className="px-3 py-2 border-t border-[#00f0ff]/10 bg-[#010409]/80">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">
                Cloudinary URL (stored in Supabase)
              </p>
              <p className="text-[10px] text-[#00f0ff]/60 font-mono truncate">
                {uploadedUrl}
              </p>
            </div>
          </motion.div>
        ) : (
          /* ── Trigger state: idle / uploading ── */
          <motion.div
            key="trigger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CldUploadWidget
              uploadPreset={uploadPreset}
              options={{
                cloudName,
                sources: ["local", "camera"],
                resourceType: "image",
                clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
                maxFileSize: 10_000_000,
                cropping: false,
                showAdvancedOptions: false,
                styles: {
                  palette: {
                    window: "#010409",
                    windowBorder: "#00f0ff33",
                    tabIcon: "#00f0ff",
                    menuIcons: "#5a7d9a",
                    textDark: "#ffffff",
                    textLight: "#0e2a39",
                    link: "#00f0ff",
                    action: "#00f0ff",
                    inactiveTabIcon: "#3d6a8e",
                    error: "#ff003c",
                    inProgress: "#00f0ff",
                    complete: "#00ff66",
                    sourceBg: "#020c18",
                  },
                },
              }}
              onSuccess={(result) =>
                handleSuccess(result as unknown as CloudinaryUploadResult)
              }
              onError={handleError}
            >
              {({ open }) => {
                const isGuest = session?.user?.isAnonymous;
                return (
                <button
                  type="button"
                  disabled={Boolean(disabled || isGuest)}
                  onClick={() => {
                    if (isGuest) return;
                    setIsUploading(true);
                    open();
                  }}
                  className={[
                    "w-full group relative flex flex-col items-center justify-center gap-3",
                    "rounded-xl border-2 border-dashed px-6 py-8",
                    "transition-all duration-300 overflow-hidden",
                    "disabled:opacity-40 disabled:cursor-not-allowed",
                    isUploading
                      ? "border-[#00f0ff]/60 bg-[#00f0ff]/5"
                      : "border-[#00f0ff]/20 bg-transparent hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/5",
                  ].join(" ")}
                >
                  {/* Glow radial on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.04),transparent_70%)]" />

                  {isGuest ? (
                    <>
                       <div className="w-14 h-14 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-center justify-center">
                         <AlertCircle className="w-6 h-6 text-amber-500/50" />
                       </div>
                       <div className="text-center space-y-1">
                         <p className="text-sm font-bold text-amber-400 tracking-wide flex items-center gap-2 justify-center">
                           Upload Locked
                         </p>
                         <p className="text-[11px] text-amber-500/70">Please register to unlock data uploads.</p>
                       </div>
                    </>
                  ) : isUploading ? (
                    <>
                      <Loader2 className="w-10 h-10 text-[#00f0ff] animate-spin drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                      <p className="text-xs text-[#00f0ff]/70 font-mono tracking-[0.25em] uppercase animate-pulse">
                        Opening Upload Dialog...
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-2xl border border-[#00f0ff]/20 bg-[#00f0ff]/5 flex items-center justify-center group-hover:border-[#00f0ff]/40 group-hover:bg-[#00f0ff]/10 transition-all duration-300">
                        <ImageIcon className="w-6 h-6 text-[#00f0ff]/50 group-hover:text-[#00f0ff] transition-colors duration-300" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-bold text-slate-200 tracking-wide flex items-center gap-2 justify-center">
                          <UploadCloud className="w-4 h-4 text-[#00f0ff]" />
                          Click to upload image
                        </p>
                        <p className="text-[11px] text-slate-500">{hint}</p>
                      </div>
                    </>
                  )}
                </button>
              )}}
            </CldUploadWidget>

            {/* Error display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 flex items-center gap-2 text-[#ff003c] text-xs"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

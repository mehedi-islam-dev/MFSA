"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#010409] text-cyan-500 font-mono p-4">
      <div className="bg-[#020b14]/80 border border-red-900/50 p-8 rounded-xl max-w-md text-center shadow-[0_0_30px_rgba(220,38,38,0.2)]">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-red-400 mb-2">SYSTEM FAILURE</h1>
        <p className="text-sm text-cyan-700 mb-6">
          {error.message || "An unexpected error occurred in the module."}
        </p>
        <button
          onClick={() => reset()}
          className="bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/60 hover:text-red-300 px-6 py-2 rounded font-bold tracking-widest text-xs transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" /> REBOOT MODULE
        </button>
      </div>
    </div>
  );
}

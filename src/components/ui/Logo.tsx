import Link from "next/link";
import Image from "next/image";
import React from "react";
import logoImg from "../../../public/logo.png";

export default function Logo({ 
  showText = true, 
  className = "",
  imageClassName = "h-14 w-auto md:h-16"
}: { 
  showText?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <Link href="/" className={`flex items-center gap-4 group ${className}`}>
      {/* Cybernetic Fish Icon Container */}
      <div className="relative flex items-center justify-center flex-shrink-0">
        {/* Dim Neon Electric Flow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-cyan-500/40 via-blue-600/30 to-teal-400/40 blur-[35px] animate-pulse rounded-full z-0 pointer-events-none"></div>
        <Image 
          src={logoImg} 
          alt="Marine Analytica Logo" 
          width={180} 
          height={80} 
          className={`relative z-10 object-contain mix-blend-lighten ${imageClassName}`}
          priority 
          unoptimized
        />
      </div>

      {/* Typography */}
      {showText && (
        <div className="hidden lg:flex flex-col justify-center">
          <h1 className="text-xl font-black tracking-[0.25em] uppercase text-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] group-hover:text-white transition-colors duration-300">
            Marine Analytica
          </h1>
          <p className="text-[10px] text-cyan-700 font-bold tracking-[0.3em] uppercase mt-1 group-hover:text-cyan-400 transition-colors duration-300">
            Autonomous Intelligence
          </p>
        </div>
      )}
    </Link>
  );
}

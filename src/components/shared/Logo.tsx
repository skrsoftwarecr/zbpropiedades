
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("fill-current", className)}
    >
      {/* Elegante símbolo de casa/techo con estilo minimalista */}
      <path
        d="M10 50 L50 15 L90 50 L90 85 L10 85 Z"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M10 50 L50 15 L90 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 85 V55 H70 V85"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="40" r="5" fill="currentColor" />
    </svg>
  );
}

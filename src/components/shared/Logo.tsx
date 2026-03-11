import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("fill-current", className)}
    >
      <circle cx="50" cy="50" r="50" fill="black" />
      <path
        d="M50,0 a50,50 0 0,1 0,100 a50,50 0 0,1 0,-100"
        fill="white"
      />
      <circle cx="50" cy="50" r="35" fill="black" />
      <path
        d="M50 20 L 50 20 L 30 70 L 42 70 L 46 58 L 54 58 L 58 70 L 70 70 L 50 20 Z M 47 50 L 53 50 L 50 40 Z"
        fill="white"
      />
    </svg>
  );
}

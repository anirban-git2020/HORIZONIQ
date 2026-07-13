import { cn } from "@/lib/utils";

/**
 * Subtle animated dot grid — CSS-only placeholder for Living Intelligence Field.
 * Opacity ~5%, almost invisible drift.
 */
export function HeroDotGrid({ className }: { className?: string }) {
  return (
    <>
      <style>{`
        @keyframes hero-dot-drift {
          0% { background-position: 0 0; }
          100% { background-position: 32px 32px; }
        }
      `}</style>
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
            backgroundSize: "32px 32px",
            animation: "hero-dot-drift 90s linear infinite",
          }}
        />
      </div>
    </>
  );
}

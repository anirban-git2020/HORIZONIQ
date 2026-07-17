"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FeedbackFabProps = {
  onClick: () => void;
  className?: string;
};

type Pos = { x: number; y: number };

const STORAGE_KEY = "horizoniq.feedbackFab.pos";
const DRAG_THRESHOLD = 6; // px of travel before a press becomes a drag
const EDGE_MARGIN = 16; // keep the FAB at least this far from every edge

function clamp(pos: Pos, w: number, h: number): Pos {
  const maxX = Math.max(EDGE_MARGIN, window.innerWidth - w - EDGE_MARGIN);
  const maxY = Math.max(EDGE_MARGIN, window.innerHeight - h - EDGE_MARGIN);
  return {
    x: Math.min(Math.max(EDGE_MARGIN, pos.x), maxX),
    y: Math.min(Math.max(EDGE_MARGIN, pos.y), maxY),
  };
}

/**
 * Feedback launcher. A tap/click opens the dialog; a press-and-drag repositions
 * the button so it never blocks content. Position is clamped to the viewport and
 * persisted across visits. Keyboard activation is unaffected (drag is
 * pointer-only), so the control stays fully accessible.
 */
export function FeedbackFab({ onClick, className }: FeedbackFabProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<Pos | null>(null);
  const [dragging, setDragging] = useState(false);

  const origin = useRef<{ px: number; py: number; ox: number; oy: number } | null>(
    null
  );
  const moved = useRef(false);

  // Restore a previously chosen position (clamped in case the viewport shrank).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Pos;
      const el = ref.current;
      setPos(clamp(saved, el?.offsetWidth ?? 0, el?.offsetHeight ?? 0));
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  // Keep the button on-screen when the window is resized.
  useEffect(() => {
    if (!pos) return;
    const onResize = () => {
      const el = ref.current;
      if (!el) return;
      setPos((p) => (p ? clamp(p, el.offsetWidth, el.offsetHeight) : p));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pos]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.button !== 0) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      origin.current = { px: e.clientX, py: e.clientY, ox: rect.left, oy: rect.top };
      moved.current = false;
      el.setPointerCapture(e.pointerId);
    },
    []
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      const start = origin.current;
      if (!start) return;
      const dx = e.clientX - start.px;
      const dy = e.clientY - start.py;
      if (!moved.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      moved.current = true;
      setDragging(true);
      const el = ref.current;
      setPos(
        clamp(
          { x: start.ox + dx, y: start.oy + dy },
          el?.offsetWidth ?? 0,
          el?.offsetHeight ?? 0
        )
      );
    },
    []
  );

  const onPointerEnd = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    origin.current = null;
    if (!moved.current) return;
    setDragging(false);
    setPos((p) => {
      if (p) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
        } catch {
          /* ignore quota / disabled storage */
        }
      }
      return p;
    });
  }, []);

  const handleClick = useCallback(() => {
    if (moved.current) {
      moved.current = false; // this was a drag, not a click — swallow it
      return;
    }
    onClick();
  }, [onClick]);

  const placed = pos !== null;

  return (
    <Button
      ref={ref}
      type="button"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onClick={handleClick}
      style={placed ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" } : undefined}
      className={cn(
        "fixed z-[90] h-12 touch-none select-none gap-2 rounded-full px-4 shadow-premium",
        !placed &&
          "bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 sm:bottom-6 sm:right-6",
        "sm:px-5",
        dragging ? "cursor-grabbing transition-none" : "cursor-grab",
        className
      )}
      aria-haspopup="dialog"
    >
      <MessageSquareText className="h-4 w-4" />
      <span className="text-sm font-medium">Feedback</span>
    </Button>
  );
}

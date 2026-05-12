"use client";

import { useMemo } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Reveal({
  children,
  className,
  once = true
}: {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ once });

  const visible = reduced ? true : inView;
  const classes = useMemo(
    () =>
      [
        "motion-reduce:transform-none motion-reduce:transition-none",
        "transition-all duration-700 ease-out will-change-transform",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        className ?? ""
      ].join(" "),
    [visible, className]
  );

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}



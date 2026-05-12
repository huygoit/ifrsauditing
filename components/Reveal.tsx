"use client";

import { useEffect, useMemo, useState } from "react";
import { useInView } from "@/hooks/useInView";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

export function Reveal({
  children,
  className,
  once = true
}: {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ once });

  const visible = reduced ? true : inView;
  const classes = useMemo(
    () =>
      [
        "motion-reduce:transform-none motion-reduce:transition-none",
        "transition-all duration-300 ease-out will-change-transform",
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



"use client";

import { useEffect, useState } from "react";

function nextViewerCount() {
  const hour = new Date().getHours();
  const base = hour >= 8 && hour <= 22 ? 82 : 37;
  return base + Math.floor(Math.random() * 34);
}

export function ViewCounter() {
  const [viewers, setViewers] = useState(nextViewerCount);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function schedule() {
      const delay = 20000 + Math.floor(Math.random() * 20000);
      timeout = setTimeout(() => {
        setViewers(nextViewerCount());
        schedule();
      }, delay);
    }

    schedule();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <p className="rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-primary shadow-sm">
      <span aria-hidden="true">👀</span> {viewers} pessoas vendo este material agora
    </p>
  );
}

"use client";

import { Clock3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function UrgencyTimer({ minutes }: { minutes: number }) {
  const totalSeconds = useMemo(() => Math.max(minutes, 1) * 60, [minutes]);
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
    const interval = setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : totalSeconds));
    }, 1000);

    return () => clearInterval(interval);
  }, [totalSeconds]);

  const minutesText = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secondsText = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 font-bold text-red-800">
      <Clock3 size={18} aria-hidden="true" />
      Oferta reservada por {minutesText}:{secondsText}
    </div>
  );
}

"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useMemo } from "react";

type Props = {
  blockedDates: string[];
};

export default function AvailabilityCalendar({ blockedDates }: Props) {
  const blocked = useMemo(
    () => blockedDates.map((d) => new Date(d + "T00:00:00")),
    [blockedDates]
  );

  return (
    <div className="fewo-calendar">
      <style>{`
        .fewo-calendar .rdp {
          --rdp-accent-color: #C4724A;
          --rdp-background-color: #E8D5C0;
          margin: 0;
        }
        .fewo-calendar .rdp-day_blocked {
          background-color: #C4724A !important;
          color: white !important;
          border-radius: 4px;
          opacity: 1 !important;
        }
        .fewo-calendar .rdp-day_blocked:hover {
          background-color: #C4724A !important;
          cursor: default;
        }
        .fewo-calendar .rdp-day {
          font-family: var(--font-dm-sans, sans-serif);
          font-size: 13px;
        }
        .fewo-calendar .rdp-caption_label {
          font-family: var(--font-playfair, serif);
          color: #2C1810;
        }
      `}</style>
      <DayPicker
        mode="multiple"
        selected={blocked}
        modifiers={{ blocked }}
        modifiersClassNames={{ blocked: "rdp-day_blocked" }}
        disabled={blocked}
        fromDate={new Date()}
        numberOfMonths={1}
      />
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#6B7C5E]" />
          <span className="font-dm text-xs text-espresso/60">Frei</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-terracotta" />
          <span className="font-dm text-xs text-espresso/60">Belegt</span>
        </div>
      </div>
    </div>
  );
}

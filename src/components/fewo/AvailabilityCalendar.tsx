"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useMemo } from "react";

type Props = {
  blockedDates: string[];
  bookedDates?: string[];
};

export default function AvailabilityCalendar({ blockedDates, bookedDates = [] }: Props) {
  const blocked = useMemo(
    () => blockedDates.map((d) => new Date(d + "T00:00:00")),
    [blockedDates]
  );
  const booked = useMemo(
    () => bookedDates.map((d) => new Date(d + "T00:00:00")),
    [bookedDates]
  );
  const allUnavailable = useMemo(() => [...blocked, ...booked], [blocked, booked]);

  return (
    <div className="fewo-calendar">
      <style>{`
        .fewo-calendar .rdp {
          --rdp-accent-color: #C4724A;
          --rdp-background-color: #E8D5C0;
          margin: 0;
        }
        .fewo-calendar .rdp-day_blocked {
          background-color: #2C1810 !important;
          color: white !important;
          border-radius: 4px;
          opacity: 0.7 !important;
        }
        .fewo-calendar .rdp-day_blocked:hover {
          background-color: #2C1810 !important;
          cursor: default;
        }
        .fewo-calendar .rdp-day_booked {
          background-color: #C4724A !important;
          color: white !important;
          border-radius: 4px;
          opacity: 1 !important;
        }
        .fewo-calendar .rdp-day_booked:hover {
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
        selected={allUnavailable}
        modifiers={{ blocked, booked }}
        modifiersClassNames={{ blocked: "rdp-day_blocked", booked: "rdp-day_booked" }}
        disabled={allUnavailable}
        fromDate={new Date()}
        numberOfMonths={1}
      />
      <div className="flex gap-5 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#6B7C5E]" />
          <span className="font-dm text-xs text-espresso/60">Frei</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-terracotta" />
          <span className="font-dm text-xs text-espresso/60">Gebucht</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-espresso opacity-70" />
          <span className="font-dm text-xs text-espresso/60">Blockiert</span>
        </div>
      </div>
    </div>
  );
}

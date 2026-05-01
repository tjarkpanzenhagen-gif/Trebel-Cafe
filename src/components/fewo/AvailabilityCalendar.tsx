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
    <div className="fewo-cal">
      <style>{`
        /* Override accent color (default is blue) */
        .fewo-cal .rdp-root {
          --rdp-accent-color: #C4724A;
          --rdp-accent-background-color: rgba(196, 114, 74, 0.15);
          --rdp-today-color: #C4724A;
          --rdp-selected-border: 2px solid #C4724A;
          --rdp-day_button-border-radius: 6px;
          margin: 0;
        }

        /* Month label */
        .fewo-cal .rdp-month_caption {
          font-family: var(--font-playfair, serif);
          color: #2C1810;
          font-size: 1rem;
        }

        /* Day cells */
        .fewo-cal .rdp-day {
          font-family: var(--font-dm-sans, sans-serif);
          font-size: 13px;
        }

        /* Booked days (from booking requests) — terracotta */
        .fewo-cal .day-booked {
          opacity: 1 !important;
        }
        .fewo-cal .day-booked .rdp-day_button {
          background-color: #C4724A !important;
          color: white !important;
          border: none !important;
          border-radius: 6px;
          cursor: default;
        }
        .fewo-cal .day-booked .rdp-day_button:hover {
          background-color: #C4724A !important;
        }

        /* Blocked days (manually blocked by admin) — espresso */
        .fewo-cal .day-blocked {
          opacity: 1 !important;
        }
        .fewo-cal .day-blocked .rdp-day_button {
          background-color: #2C1810 !important;
          color: rgba(255,255,255,0.7) !important;
          border: none !important;
          border-radius: 6px;
          cursor: default;
        }
        .fewo-cal .day-blocked .rdp-day_button:hover {
          background-color: #2C1810 !important;
        }
      `}</style>
      <DayPicker
        mode="multiple"
        selected={[]}
        modifiers={{ blocked, booked }}
        modifiersClassNames={{ blocked: "day-blocked", booked: "day-booked" }}
        disabled={allUnavailable}
        fromDate={new Date()}
        numberOfMonths={1}
      />
      <div className="flex gap-5 mt-2">
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

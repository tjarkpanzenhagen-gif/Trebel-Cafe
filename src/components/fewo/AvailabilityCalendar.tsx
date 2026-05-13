"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useMemo } from "react";

type Props = {
  availableDates: string[];
  bookedDates?: string[];
};

export default function AvailabilityCalendar({ bookedDates = [] }: Props) {
  const booked = useMemo(
    () => bookedDates.map((d) => new Date(d + "T00:00:00")),
    [bookedDates]
  );
  const free = useMemo(() => [] as Date[], []);

  return (
    <div className="fewo-cal">
      <style>{`
        .fewo-cal .rdp-root {
          --rdp-accent-color: #6B7C5E;
          --rdp-accent-background-color: rgba(107,124,94,0.15);
          --rdp-today-color: #C4724A;
          --rdp-selected-border: 2px solid transparent;
          --rdp-day_button-border-radius: 6px;
          margin: 0;
        }
        .fewo-cal .rdp-month_caption {
          font-family: var(--font-playfair, serif);
          color: #2C1810;
          font-size: 1rem;
        }
        .fewo-cal .rdp-day {
          font-family: var(--font-dm-sans, sans-serif);
          font-size: 13px;
        }
        /* Frei — grün */
        .fewo-cal .day-free .rdp-day_button {
          background-color: #6B7C5E !important;
          color: white !important;
          border: none !important;
          border-radius: 6px;
          cursor: pointer;
        }
        .fewo-cal .day-free { opacity: 1 !important; }
        /* Gebucht — terracotta */
        .fewo-cal .day-booked .rdp-day_button {
          background-color: #C4724A !important;
          color: white !important;
          border: none !important;
          border-radius: 6px;
          cursor: default;
        }
        .fewo-cal .day-booked { opacity: 1 !important; }
        /* Nicht buchbar — grau/weiß, dezent ausgegraut */
        .fewo-cal .rdp-disabled:not(.day-free):not(.day-booked) .rdp-day_button {
          color: #ccc !important;
        }
      `}</style>
      <DayPicker
        mode="multiple"
        selected={[]}
        modifiers={{ free, booked }}
        modifiersClassNames={{ free: "day-free", booked: "day-booked" }}
        disabled={(date) => {
          const key = date.toDateString();
          return booked.some((d) => d.toDateString() === key);
        }}
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
      </div>
    </div>
  );
}

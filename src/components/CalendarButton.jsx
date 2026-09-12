import React from "react";
import { CalendarPlus, Calendar, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { buildCalendarEvent, downloadIcs } from "@/lib/calendarUtils";

export default function CalendarButton({ event, compact = false }) {
  const { googleUrl, ics, filename } = buildCalendarEvent(event);

  const handleIcs = (e) => {
    e.preventDefault();
    downloadIcs(filename, ics);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title="Add to calendar"
          className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-2.5 py-1.5 transition-colors bg-primary/10 text-primary hover:bg-primary/20 ${
            compact ? "" : "whitespace-nowrap"
          }`}
        >
          <CalendarPlus className="w-3.5 h-3.5" />
          {!compact && <span>Add to Calendar</span>}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer">
            <Calendar className="w-4 h-4" /> Google Calendar
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleIcs} className="flex items-center gap-2 cursor-pointer">
          <Download className="w-4 h-4" /> Download .ics
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
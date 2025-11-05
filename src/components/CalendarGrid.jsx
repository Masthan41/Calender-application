import React, { useState } from "react";
import { Pencil, Trash2, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

// Holiday data for 2024-2025
const holidays = {
  2024: {
    0: [{ day: 1, name: "New Year's Day", type: "national" }, { day: 26, name: "Republic Day", type: "national" }],
    2: [{ day: 8, name: "Maha Shivaratri", type: "religious" }, { day: 25, name: "Holi", type: "religious" }],
    3: [{ day: 11, name: "Eid ul-Fitr", type: "religious" }, { day: 17, name: "Ram Navami", type: "religious" }],
    4: [{ day: 1, name: "May Day", type: "national" }],
    6: [{ day: 17, name: "Eid al-Adha", type: "religious" }],
    7: [{ day: 15, name: "Independence Day", type: "national" }, { day: 26, name: "Janmashtami", type: "religious" }],
    9: [{ day: 2, name: "Gandhi Jayanti", type: "national" }, { day: 12, name: "Dussehra", type: "religious" }, { day: 31, name: "Diwali", type: "religious" }],
    10: [{ day: 1, name: "Diwali Holiday", type: "religious" }, { day: 15, name: "Guru Nanak Jayanti", type: "religious" }],
    11: [{ day: 25, name: "Christmas", type: "religious" }]
  },
  2025: {
    0: [{ day: 1, name: "New Year's Day", type: "national" }, { day: 26, name: "Republic Day", type: "national" }],
    2: [{ day: 14, name: "Holi", type: "religious" }, { day: 26, name: "Maha Shivaratri", type: "religious" }],
    3: [{ day: 31, name: "Eid ul-Fitr", type: "religious" }],
    4: [{ day: 1, name: "May Day", type: "national" }],
    6: [{ day: 7, name: "Eid al-Adha", type: "religious" }],
    7: [{ day: 15, name: "Independence Day", type: "national" }, { day: 16, name: "Janmashtami", type: "religious" }],
    9: [{ day: 2, name: "Gandhi Jayanti", type: "national" }, { day: 2, name: "Dussehra", type: "religious" }, { day: 20, name: "Diwali", type: "religious" }],
    10: [{ day: 5, name: "Guru Nanak Jayanti", type: "religious" }],
    11: [{ day: 25, name: "Christmas", type: "religious" }]
  }
};

export default function CalendarGrid({ currentMonth, currentYear, events, onEdit, onDelete }) {
  const today = new Date();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  const days = Array.from({ length: firstDay + totalDays }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );

  const isToday = (day) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const getEventsForDay = (day) =>
    events.filter((ev) => {
      const evDate = new Date(ev.date);
      return (
        evDate.getDate() === day &&
        evDate.getMonth() === currentMonth &&
        evDate.getFullYear() === currentYear
      );
    });

  const getHolidayForDay = (day) => {
    const yearHolidays = holidays[currentYear];
    if (!yearHolidays || !yearHolidays[currentMonth]) return null;
    return yearHolidays[currentMonth].find(h => h.day === day);
  };

  const isWeekend = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.getDay() === 0 || date.getDay() === 6;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg">
      <div className="grid grid-cols-7 gap-3">
        {/* Weekday Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, idx) => (
          <div 
            key={d} 
            className={`font-bold text-sm text-center py-2 ${
              idx === 0 || idx === 6 ? "text-red-500" : "text-gray-700"
            }`}
          >
            {d}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, i) => {
          if (!day) return <div key={i} className="h-28"></div>;

          const dayEvents = getEventsForDay(day);
          const holiday = getHolidayForDay(day);
          const isActive = isToday(day);
          const weekend = isWeekend(day);

          return (
            <div
              key={i}
              className={`h-28 flex flex-col rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden relative ${
                isActive
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-600 text-white shadow-lg scale-105"
                  : holiday
                  ? "bg-gradient-to-br from-orange-100 to-red-100 border-orange-300 hover:shadow-md"
                  : weekend
                  ? "bg-red-50 border-red-200 hover:bg-red-100"
                  : "bg-white border-gray-200 hover:bg-gray-50 hover:shadow-md"
              }`}
            >
              {/* Date Number */}
              <div className="flex-1 flex flex-col items-center justify-center p-2">
                <div className={`text-xl font-bold ${
                  isActive ? "text-white" : holiday ? "text-orange-700" : weekend ? "text-red-600" : "text-gray-800"
                }`}>
                  {day}
                </div>

                {/* Holiday Badge */}
                {holiday && (
                  <div className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    holiday.type === "national" 
                      ? "bg-orange-500 text-white" 
                      : "bg-purple-500 text-white"
                  }`}>
                    {holiday.name}
                  </div>
                )}

                {/* Event Indicators */}
                {dayEvents.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {dayEvents.slice(0, 3).map((ev, idx) => (
                      <span
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white" : ""}`}
                        style={!isActive ? { backgroundColor: ev.color || "#3b82f6" } : undefined}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className={`text-[10px] font-bold ${isActive ? "text-white" : "text-blue-600"}`}>
                        +{dayEvents.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Events List */}
              {dayEvents.length > 0 && (
                <div className="px-1 pb-1 space-y-1 max-h-12 overflow-y-auto scrollbar-thin">
                  {dayEvents.slice(0, 2).map((ev, idx) => (
                    <div
                      key={idx}
                      className={`relative flex items-center justify-between w-full rounded-md px-1.5 py-0.5 text-[10px] shadow-sm group ${
                        isActive 
                          ? "bg-white/20 text-white backdrop-blur-sm" 
                          : "text-white"
                      }`}
                      style={!isActive ? { backgroundColor: ev.color || "#3b82f6" } : undefined}
                      title={`${ev.title}${ev.time ? " • " + ev.time : ""}`}
                    >
                      <span className="truncate font-medium">{ev.title}</span>
                      <div className="absolute right-0.5 top-0 bottom-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition bg-gradient-to-l from-blue-600 to-transparent pl-3 pr-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(ev);
                          }}
                          className="p-0.5 hover:bg-white/20 rounded"
                          title="Edit"
                        >
                          <Pencil size={10} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(ev);
                          }}
                          className="p-0.5 hover:bg-white/20 rounded"
                          title="Delete"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Corner accent for today */}
              {isActive && (
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-yellow-400 border-r-transparent"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-indigo-600"></div>
          <span className="text-xs text-gray-700 font-medium">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-100 to-red-100 border border-orange-300"></div>
          <span className="text-xs text-gray-700 font-medium">Holiday</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-50 border border-red-200"></div>
          <span className="text-xs text-gray-700 font-medium">Weekend</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-700 font-medium">Event</span>
        </div>
      </div>
    </div>
  );
}

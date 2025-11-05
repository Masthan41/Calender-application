import React, { useMemo, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";

export default function Header({
  currentMonth,
  currentYear,
  handlePrevMonth,
  handleNextMonth,
  handleToday,
  setIsModalOpen,
  events = [],
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", {
    month: "long",
  });

  const handleMonthChange = (direction) => {
    setIsAnimating(true);
    direction === "prev" ? handlePrevMonth() : handleNextMonth();
    setTimeout(() => setIsAnimating(false), 300);
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString("default", { 
      weekday: "long", 
      month: "short", 
      day: "numeric" 
    });
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  // Derived stats
  const monthEventsCount = useMemo(() => {
    const safe = (d) => {
      const dt = new Date(d?.date || d);
      return isNaN(dt) ? null : dt;
    };
    return events.filter((ev) => {
      const d = safe(ev.date);
      return d && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;
  }, [events, currentMonth, currentYear]);

  const upcomingCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events.filter((ev) => {
      const d = new Date(ev.date);
      if (isNaN(d)) return false;
      d.setHours(0, 0, 0, 0);
      return d >= today;
    }).length;
  }, [events]);

  return (
    <div className="relative">
      {/* Main Header Container */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Decorative accent line */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            {/* Left Section - Date Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Calendar className="text-blue-600" size={24} />
                </div>
                <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {monthName} {currentYear}
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 ml-14">
                <Clock size={14} />
                <p>{getCurrentDate()}</p>
              </div>
              
              <p className="text-gray-500 text-sm mt-2 ml-14">
                Organize your schedule and never miss an important event
              </p>
            </div>

            {/* Right Section - Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Navigation Controls */}
              <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => handleMonthChange("prev")}
                  className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 border-r border-gray-200 group"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                
                <button
                  onClick={handleToday}
                  className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isCurrentMonth()
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Today
                </button>
                
                <button
                  onClick={() => handleMonthChange("next")}
                  className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 border-l border-gray-200 group"
                  aria-label="Next month"
                >
                  <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Add Event Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <Plus size={18} className="relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                <span className="relative z-10">Add Event</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Quick Stats Bar */}
      <div className="mt-4 flex gap-4 px-2">
        <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">This Month</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{monthEventsCount}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{upcomingCount}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Clock className="text-purple-600" size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Calendar, Clock, Trash2, MapPin, Search, ChevronDown, Edit2 } from 'lucide-react';

// Sample data for demonstration
const sampleEvents = [
  {
    id: 1,
    title: "Team Meeting",
    date: "2025-11-06",
    time: "10:00 AM",
    location: "Conference Room A",
    category: "Work",
    description: "Quarterly planning discussion"
  },
  {
    id: 2,
    title: "Dentist Appointment",
    date: "2025-11-08",
    time: "2:30 PM",
    location: "Downtown Dental Clinic",
    category: "Personal",
    description: "Regular checkup"
  },
  {
    id: 3,
    title: "Coffee with Sarah",
    date: "2025-11-10",
    time: "4:00 PM",
    location: "Starbucks Main St",
    category: "Social",
    description: "Catch up session"
  },
  {
    id: 4,
    title: "Project Deadline",
    date: "2025-11-15",
    time: "11:59 PM",
    location: "Remote",
    category: "Work",
    description: "Submit final report"
  },
  {
    id: 5,
    title: "Birthday Party",
    date: "2025-11-20",
    time: "6:00 PM",
    location: "The Garden Restaurant",
    category: "Social",
    description: "John's 30th birthday celebration"
  }
];

const categoryColors = {
  Work: "bg-blue-100 text-blue-700 border-blue-200",
  Personal: "bg-green-100 text-green-700 border-green-200",
  Social: "bg-purple-100 text-purple-700 border-purple-200",
  Other: "bg-gray-100 text-gray-700 border-gray-200"
};

export default function EventList({ events = sampleEvents, onDelete, onEdit }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("list");
  const [expandedEvent, setExpandedEvent] = useState(null);

  const filteredEvents = events
    .filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || e.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const categories = ["All", ...new Set(events.map(e => e.category || "Other"))];

  const isEventPast = (date) => {
    return new Date(date) < new Date();
  };

  const isEventToday = (date) => {
    const today = new Date();
    const eventDate = new Date(date);
    return today.toDateString() === eventDate.toDateString();
  };

  const getDaysUntil = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg border border-blue-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
            <Calendar className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">My Events</h2>
            <p className="text-sm text-gray-600">{filteredEvents.length} upcoming</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === "list" ? "compact" : "list")}
            className="px-3 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition text-sm font-medium text-gray-700"
          >
            {viewMode === "list" ? "Compact" : "Detailed"}
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-xl">
          <Calendar className="w-12 h-12 mb-3 opacity-50" />
          <p className="font-medium text-lg">No events found</p>
          <p className="text-sm">
            {searchQuery || selectedCategory !== "All" 
              ? "Try adjusting your filters" 
              : "Your calendar is clear 🎉"}
          </p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
          {filteredEvents.map((e) => {
            const daysUntil = getDaysUntil(e.date);
            const isPast = isEventPast(e.date);
            const isToday = isEventToday(e.date);
            const isExpanded = expandedEvent === e.id;

            return (
              <li
                key={e.id}
                className={`bg-white rounded-xl border-2 transition-all duration-200 ${
                  isPast 
                    ? "border-gray-200 opacity-60" 
                    : isToday 
                    ? "border-orange-300 shadow-md" 
                    : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      {/* Title and Category */}
                      <div className="flex items-start gap-2 mb-2">
                        <h3 className={`font-semibold text-lg ${isPast ? "text-gray-500" : "text-gray-800"}`}>
                          {e.title}
                        </h3>
                        {isToday && (
                          <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                            TODAY
                          </span>
                        )}
                      </div>

                      {/* Date and Time */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{formatDate(e.date)}</span>
                          {!isPast && daysUntil >= 0 && (
                            <span className="text-xs text-gray-500">
                              ({daysUntil === 0 ? "today" : daysUntil === 1 ? "tomorrow" : `in ${daysUntil} days`})
                            </span>
                          )}
                        </div>
                        {e.time && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>{e.time}</span>
                          </div>
                        )}
                      </div>

                      {/* Location and Category - Compact Mode */}
                      {viewMode === "list" && (
                        <div className="flex items-center gap-3 flex-wrap">
                          {e.location && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span>{e.location}</span>
                            </div>
                          )}
                          {e.category && (
                            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${categoryColors[e.category] || categoryColors.Other}`}>
                              {e.category}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Expanded Details */}
                      {isExpanded && e.description && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-700 leading-relaxed">{e.description}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-start gap-1">
                      {e.description && (
                        <button
                          onClick={() => setExpandedEvent(isExpanded ? null : e.id)}
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                          title={isExpanded ? "Show less" : "Show more"}
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(e)}
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                          title="Edit event"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(e)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Summary Footer */}
      {filteredEvents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              {filteredEvents.filter(e => !isEventPast(e.date)).length} upcoming events
            </span>
            <span className="text-gray-600">
              {filteredEvents.filter(e => isEventToday(e.date)).length} today
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

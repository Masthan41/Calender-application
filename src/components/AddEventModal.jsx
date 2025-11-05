import React, { useState, useEffect } from "react";
import { CalendarDays, Clock, X, Pencil, Bell, FileText, Tag } from "lucide-react";

export default function AddEventModal({ setIsModalOpen, addEvent, editingEvent, defaultEventColor = "#3b82f6" }) {
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    duration: "30",
    category: "meeting",
    description: "",
    reminder: "15",
    isAllDay: false,
    color: defaultEventColor,
  });

  const categories = [
    { value: "meeting", label: "Meeting", color: "bg-blue-500" },
    { value: "call", label: "Call", color: "bg-green-500" },
    { value: "task", label: "Task", color: "bg-purple-500" },
    { value: "personal", label: "Personal", color: "bg-pink-500" },
    { value: "other", label: "Other", color: "bg-gray-500" }
  ];

  const durations = [
    { value: "15", label: "15 min" },
    { value: "30", label: "30 min" },
    { value: "60", label: "1 hour" },
    { value: "120", label: "2 hours" },
    { value: "240", label: "4 hours" }
  ];

  const reminders = [
    { value: "0", label: "At time of event" },
    { value: "15", label: "15 minutes before" },
    { value: "30", label: "30 minutes before" },
    { value: "60", label: "1 hour before" },
    { value: "1440", label: "1 day before" }
  ];

  useEffect(() => {
    if (editingEvent) {
      setForm(editingEvent);
    } else {
      setForm((f) => ({ ...f, color: defaultEventColor }));
    }
  }, [editingEvent, defaultEventColor]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    addEvent({ ...form, color: form.color || defaultEventColor });
    setIsModalOpen(false);
  };

  const selectedCategory = categories.find(cat => cat.value === form.category);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <div className={`${selectedCategory.color} h-2 rounded-t-3xl`}></div>
        
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {editingEvent ? "Update your event details" : "Add a new event to your calendar"}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Team Meeting, Doctor Appointment"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Category
              </label>
              <div className="grid grid-cols-5 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat.value })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium transition ${
                      form.category === cat.value
                        ? `${cat.color} text-white shadow-md`
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-gray-900"
                  />
                  <CalendarDays className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Time {form.isAllDay && "(All Day)"}
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-gray-900 disabled:bg-gray-50 disabled:text-gray-400"
                    disabled={form.isAllDay}
                  />
                  <Clock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">All-day event</p>
                  <p className="text-xs text-gray-500">This event lasts the entire day</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isAllDay}
                  onChange={(e) => setForm({ ...form, isAllDay: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {!form.isAllDay && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-gray-900 bg-white"
                  >
                    {durations.map((dur) => (
                      <option key={dur.value} value={dur.value}>
                        {dur.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Reminder
                  </label>
                  <select
                    value={form.reminder}
                    onChange={(e) => setForm({ ...form, reminder: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-gray-900 bg-white"
                  >
                    {reminders.map((rem) => (
                      <option key={rem.value} value={rem.value}>
                        {rem.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description (Optional)
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Add notes, links, or any additional details..."
                rows="3"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-gray-900 placeholder-gray-400 resize-none"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t-2 border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className={`px-6 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg ${
                  editingEvent
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {editingEvent ? (
                  <>
                    <Pencil className="w-4 h-4" /> Update Event
                  </>
                ) : (
                  <>
                    <CalendarDays className="w-4 h-4" /> Create Event
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import CalendarGrid from "./components/CalendarGrid.jsx";
import EventList from "./components/EventList.jsx";
import AddEventModal from "./components/AddEventModal.jsx";
import Settings from "./components/Settings.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState(() => {
    try {
      const raw = localStorage.getItem("events");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // UI/Settings state
  const [activeSection, setActiveSection] = useState("calendar");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "auto");
  const [defaultEventColor, setDefaultEventColor] = useState(() => localStorage.getItem("defaultEventColor") || "#3b82f6");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  const handleToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  // CRUD Operations
  const addEvent = (newEvent) => {
    if (editingEvent) {
      // Update existing event
      setEvents((prev) =>
        prev.map((ev) => (ev === editingEvent ? { ...ev, ...newEvent } : ev))
      );
      setEditingEvent(null);
    } else {
      // Add new event
      setEvents([...events, newEvent]);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (event) => {
    if (confirm(`Delete event: "${event.title}"?`)) {
      setEvents(events.filter((e) => e !== event));
    }
  };

  // Sidebar navigation
  const handleSidebarNavigation = (section) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Theme effect
  useEffect(() => {
    const root = document.documentElement;
    let mediaQuery;
    const apply = (mode) => {
      if (mode === "dark") root.classList.add("dark");
      else if (mode === "light") root.classList.remove("dark");
      else {
        const prefersDark =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) root.classList.add("dark");
        else root.classList.remove("dark");
      }
    };
    apply(theme);
    localStorage.setItem("theme", theme);
    if (theme === "auto" && window.matchMedia) {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => apply("auto");
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery && mediaQuery.removeEventListener("change", handler);
    }
  }, [theme]);

  // Persist default event color
  useEffect(() => {
    localStorage.setItem("defaultEventColor", defaultEventColor);
  }, [defaultEventColor]);

  // Persist events
  useEffect(() => {
    try {
      localStorage.setItem("events", JSON.stringify(events));
    } catch {}
  }, [events]);

  // Settings handlers
  const handleImport = (imported) => {
    if (!Array.isArray(imported))
      return alert("Invalid file: expected an array of events");
    setEvents(imported);
  };

  const handleExport = () => {
    const data = JSON.stringify(events, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "events.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm("Clear all events?")) {
      setEvents([]);
      try {
        localStorage.removeItem("events");
      } catch {}
    }
  };

  // Main render
  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar onNavigate={handleSidebarNavigation} activeSection={activeSection} />

      {/* Main content */}
      <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
        {/* DASHBOARD SECTION */}
        {activeSection === "dashboard" && <Dashboard events={events} />}

        {/* CALENDAR SECTION */}
        {activeSection === "calendar" && (
          <>
            <Header
              currentMonth={currentMonth}
              currentYear={currentYear}
              handlePrevMonth={handlePrevMonth}
              handleNextMonth={handleNextMonth}
              handleToday={handleToday}
              setIsModalOpen={setIsModalOpen}
              events={events}
            />
            <CalendarGrid
              currentMonth={currentMonth}
              currentYear={currentYear}
              events={events}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          </>
        )}

        {/* EVENTS SECTION */}
        {activeSection === "events" && (
          <EventList events={events} />
        )}

        {/* SETTINGS SECTION */}
        {activeSection === "settings" && (
          <Settings
            theme={theme}
            setTheme={setTheme}
            defaultEventColor={defaultEventColor}
            setDefaultEventColor={setDefaultEventColor}
            onImport={handleImport}
            onExport={handleExport}
            onReset={handleReset}
            eventsCount={events.length}
          />
        )}

        {/* ADD/EDIT MODAL */}
        {isModalOpen && (
          <AddEventModal
            setIsModalOpen={setIsModalOpen}
            addEvent={addEvent}
            editingEvent={editingEvent}
            defaultEventColor={defaultEventColor}
          />
        )}
      </div>
    </div>
  );
}

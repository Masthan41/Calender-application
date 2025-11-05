// src/components/Settings.jsx
import React, { useRef, useEffect } from "react";
import { Moon, Sun, Upload, Download, Palette, RotateCcw, Sliders, Sparkles, AlertTriangle } from "lucide-react";

const PALETTE = [
  { color: "#3b82f6", name: "Ocean Blue" },
  { color: "#22c55e", name: "Fresh Green" },
  { color: "#a855f7", name: "Royal Purple" },
  { color: "#ef4444", name: "Cherry Red" },
  { color: "#f59e0b", name: "Sunset Orange" },
  { color: "#06b6d4", name: "Cyan" },
  { color: "#eab308", name: "Golden Yellow" },
  { color: "#84cc16", name: "Lime" },
  { color: "#ec4899", name: "Hot Pink" },
  { color: "#64748b", name: "Cool Gray" }
];

export default function Settings({
  theme,
  setTheme,
  defaultEventColor,
  setDefaultEventColor,
  onImport,
  onExport,
  onReset,
  eventsCount = 0,
}) {
  const fileRef = useRef(null);

  // Apply theme changes to document root
   useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (isDark) => {
      root.classList.toggle("dark", isDark);
    };

    // Always remove leftover classes
    root.classList.remove("light", "dark");

    if (theme === "dark") {
      applyTheme(true);
    } else if (theme === "light") {
      applyTheme(false);
    } else if (theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches);

      const handleChange = (e) => applyTheme(e.matches);
      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    // ✅ Persist selection
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleFile = async (file) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      onImport && onImport(data);
    } catch (e) {
      alert("Failed to read JSON file");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="relative flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Sliders className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Customize your calendar experience
              </p>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Appearance</h2>
          </div>

          {/* Theme Selection */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              Theme Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { 
                  key: "light", 
                  label: "Light", 
                  icon: <Sun className="w-5 h-5" />,
                  gradient: "from-amber-400 to-orange-500"
                },
                { 
                  key: "dark", 
                  label: "Dark", 
                  icon: <Moon className="w-5 h-5" />,
                  gradient: "from-indigo-500 to-purple-600"
                },
                { 
                  key: "auto", 
                  label: "Auto", 
                  icon: <Sliders className="w-5 h-5" />,
                  gradient: "from-cyan-500 to-blue-600"
                },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setTheme(opt.key)}
                  className={`relative group p-6 rounded-2xl border-2 transition-all duration-300 ${
                    theme === opt.key
                      ? "border-blue-500 dark:border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 shadow-lg scale-105"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
                  }`}
                >
                  {theme === opt.key && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
                  )}
                  <div className="relative flex flex-col items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${opt.gradient} text-white shadow-lg ${
                      theme === opt.key ? "scale-110" : "group-hover:scale-105"
                    } transition-transform`}>
                      {opt.icon}
                    </div>
                    <span className={`font-semibold ${
                      theme === opt.key 
                        ? "text-gray-900 dark:text-white" 
                        : "text-gray-600 dark:text-gray-400"
                    }`}>
                      {opt.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Active: <span className="font-semibold">{theme}</span> {theme === "auto" && "· Synced with system"}
              </p>
            </div>
          </div>
        </div>

     

        {/* Data Management */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
              <Download className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Management</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
       

            <button
              onClick={onExport}
              disabled={eventsCount === 0}
              className={`group relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300 ${
                eventsCount === 0
                  ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed opacity-50"
                  : "border-green-500 dark:border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 hover:shadow-lg hover:scale-105"
              }`}
            >
              <div className="relative flex flex-col items-center gap-3 text-center">
                <div className={`p-3 rounded-xl transition-transform ${
                  eventsCount === 0 
                    ? "bg-gray-200 dark:bg-gray-700" 
                    : "bg-green-100 dark:bg-green-900/30 group-hover:scale-110"
                }`}>
                  <Download className={`w-6 h-6 ${
                    eventsCount === 0 
                      ? "text-gray-400 dark:text-gray-600" 
                      : "text-green-600 dark:text-green-400"
                  }`} />
                </div>
                <div>
                  <p className={`font-semibold ${
                    eventsCount === 0 
                      ? "text-gray-400 dark:text-gray-600" 
                      : "text-gray-900 dark:text-white"
                  }`}>
                    Export Data
                  </p>
                  <p className={`text-sm mt-1 ${
                    eventsCount === 0 
                      ? "text-gray-400 dark:text-gray-600" 
                      : "text-gray-600 dark:text-gray-400"
                  }`}>
                    {eventsCount} {eventsCount === 1 ? 'event' : 'events'}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-red-200 dark:border-red-800 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-red-900 dark:text-red-200">Danger Zone</h2>
          </div>

          <div className="bg-white/50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Reset All Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                This will permanently delete all events, settings, and preferences. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={onReset}
              className="group w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
            >
              <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Reset Calendar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// src/components/Sidebar.jsx
import React, { useState } from "react";
import {
  CalendarDays,
  List,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import profileImg from "../assets/profileImg.jpg";

export default function Sidebar({ onNavigate, activeSection }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, title: "Dashboard" },
    { id: "calendar", icon: CalendarDays, title: "Calendar" },
    { id: "events", icon: List, title: "Events" },
    { id: "settings", icon: Settings, title: "Settings" },
  ];

  const handleClick = (section) => {
    if (onNavigate) onNavigate(section);
    setShowProfileMenu(false);
  };

  return (
    <div
      className={`relative bg-white shadow-md flex flex-col justify-between border-r transition-all duration-300
      dark:bg-gray-900 dark:border-gray-800
      ${collapsed ? "w-16" : "w-60"}
    `}
    >
      {/* Collapse/Expand toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 right-2 text-gray-500 hover:text-blue-600"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
      </button>

      {/* Navigation Section */}
      <div className="flex flex-col items-center mt-16 px-2 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`w-full flex items-center rounded-lg transition-all
                ${collapsed ? "justify-center p-3" : "justify-start px-4 py-3"}
                ${
                  isActive
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600"
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="ml-3 font-medium">{item.title}</span>}
            </button>
          );
        })}
      </div>

      {/* Profile Section */}
      <div className="relative px-4 py-4 border-t dark:border-gray-800">
        <div
          className={`flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-all ${
            collapsed ? "justify-center" : ""
          }`}
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <img
            src={profileImg}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
          />
          {!collapsed && (
            <div className="ml-3 flex flex-col text-left">
              <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
               Md Mastan
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Developer
              </span>
            </div>
          )}
        </div>

        {/* Dropdown Menu */}
        {showProfileMenu && !collapsed && (
          <div className="absolute bottom-16 left-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl w-44 py-2 border dark:border-gray-800 animate-fadeIn">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left rounded-md">
              <User size={16} /> Profile
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 w-full text-left rounded-md">
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

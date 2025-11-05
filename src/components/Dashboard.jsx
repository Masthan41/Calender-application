import React, { useState, useEffect } from 'react';
import { Search, Calendar, Trophy, Clock } from 'lucide-react';

export default function Dashboard({ events = [] }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Calculate stats from actual events data
  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    });
  };

  const getEventsThisWeek = () => {
    const today = new Date();
    const weekFromNow = new Date(today);
    weekFromNow.setDate(today.getDate() + 7);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= weekFromNow;
    });
  };

  const getCompletedTasks = () => {
    return events.filter(event => event.completed === true);
  };

  const getCompletedThisWeek = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    
    return events.filter(event => {
      if (!event.completed) return false;
      const completedDate = event.completedDate ? new Date(event.completedDate) : new Date(event.date);
      return completedDate >= weekAgo && completedDate <= today;
    });
  };

  const getPendingItems = () => {
    return events.filter(event => !event.completed);
  };

  const getOverdueItems = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events.filter(event => {
      if (event.completed) return false;
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate < today;
    });
  };

  const upcomingEvents = getUpcomingEvents();
  const eventsThisWeek = getEventsThisWeek();
  const completedTasks = getCompletedTasks();
  const completedThisWeek = getCompletedThisWeek();
  const pendingItems = getPendingItems();
  const overdueItems = getOverdueItems();

  const stats = [
    {
      title: 'Upcoming Events',
      value: upcomingEvents.length.toString(),
      subtitle: `${eventsThisWeek.length} this week`,
      icon: Calendar,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      bgLightDark: 'dark:bg-blue-900/20'
    },
    {
      title: 'Completed Tasks',
      value: completedTasks.length.toString(),
      subtitle: `+${completedThisWeek.length} this week`,
      icon: Trophy,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      bgLightDark: 'dark:bg-purple-900/20'
    },
    {
      title: 'Pending Items',
      value: pendingItems.length.toString(),
      subtitle: `${overdueItems.length} overdue`,
      icon: Clock,
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50',
      bgLightDark: 'dark:bg-orange-900/20'
    }
  ];

  // Filter events based on search
  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Welcome back, User!
              </h1>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="text-sm">{formatDate(currentTime)}</span>
                <span className="text-sm">•</span>
                <span className="text-sm font-semibold">{formatTime(currentTime)}</span>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgLight} ${stat.bgLightDark} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 text-${stat.color.split('-')[1]}-500`} />
                  </div>
                </div>
                
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                  {stat.title}
                </h3>
                
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {stat.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search Results or Recent Events */}
      {searchQuery && (
        <div className="max-w-7xl mx-auto mt-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Search Results ({filteredEvents.length})
            </h2>
            {filteredEvents.length > 0 ? (
              <div className="space-y-3">
                {filteredEvents.slice(0, 5).map((event, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: event.color || '#3b82f6' }}
                      />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{event.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No events found matching "{searchQuery}"</p>
            )}
          </div>
        </div>
      )}

      {/* Additional Info Section */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Quick Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your dashboard provides a comprehensive view of your activities. You have {events.length} total events, 
            with {upcomingEvents.length} upcoming and {overdueItems.length} overdue items that need attention.
          </p>
        </div>
      </div>
    </div>
  );
}

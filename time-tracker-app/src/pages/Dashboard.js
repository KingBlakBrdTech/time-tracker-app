
import React, { useState, useEffect } from "react";
import { TimeEntry } from "@/entities/TimeEntry";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Square, Coffee } from "lucide-react";
import { format, differenceInMinutes } from "date-fns";

import ClockControls from "../components/time/ClockControls";
import CurrentSession from "../components/time/CurrentSession";
import TodaySummary from "../components/time/TodaySummary";

export default function Dashboard() {
  const [currentEntry, setCurrentEntry] = useState(null);
  const [todayEntries, setTodayEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      const today = format(new Date(), "yyyy-MM-dd");
      const entries = await TimeEntry.filter({ 
        created_by: userData.email, 
        date: today 
      }, "-clock_in_time");
      
      setTodayEntries(entries);
      
      const activeEntry = entries.find(entry => entry.status !== "clocked_out");
      setCurrentEntry(activeEntry);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleClockIn = async ({ tasks, location, notes }) => {
    const now = new Date();
    const today = format(now, "yyyy-MM-dd");
    
    await TimeEntry.create({
      clock_in_time: now.toISOString(),
      date: today,
      status: "clocked_in",
      tasks,
      location,
      notes,
      break_duration: 0
    });
    
    await loadData();
  };

  const handleClockOut = async ({ notes }) => {
    if (!currentEntry) return;
    
    const now = new Date();
    const clockInTime = new Date(currentEntry.clock_in_time);
    const totalMinutes = differenceInMinutes(now, clockInTime) - (currentEntry.break_duration || 0);
    const totalHours = totalMinutes / 60;
    
    await TimeEntry.update(currentEntry.id, {
      clock_out_time: now.toISOString(),
      status: "clocked_out",
      total_hours: totalHours,
      notes: notes || currentEntry.notes
    });
    
    await loadData();
  };

  const handleBreakToggle = async () => {
    if (!currentEntry) return;
    
    const now = new Date();
    const newStatus = currentEntry.status === "on_break" ? "clocked_in" : "on_break";
    
    await TimeEntry.update(currentEntry.id, {
      status: newStatus
    });
    
    await loadData();
  };

  const getTotalHoursToday = () => {
    return todayEntries.reduce((total, entry) => {
      if (entry.status === "clocked_out" && entry.total_hours) {
        return total + entry.total_hours;
      }
      if (entry.status !== "clocked_out" && entry.clock_in_time) {
        const clockInTime = new Date(entry.clock_in_time);
        const minutes = differenceInMinutes(currentTime, clockInTime) - (entry.break_duration || 0);
        return total + (minutes / 60);
      }
      return total;
    }, 0);
  };

  const getCurrentSessionDuration = () => {
    if (!currentEntry?.clock_in_time) return 0;
    
    try {
      const clockInTime = new Date(currentEntry.clock_in_time);
      const minutes = differenceInMinutes(currentTime, clockInTime) - (currentEntry.break_duration || 0);
      return Math.max(0, minutes);
    } catch (error) {
      return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">
            Welcome back, <span className="text-blue-600">{user?.full_name?.split(' ')[0] || 'User'}</span>
          </h1>
          <p className="text-lg text-slate-600">
            {format(currentTime, "EEEE, MMMM do, yyyy")}
          </p>
          <div className="text-2xl font-mono font-semibold text-slate-800">
            {format(currentTime, "h:mm:ss a")}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex justify-center">
          <div className="bg-white rounded-full px-6 py-3 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3">
              {currentEntry?.status === "clocked_in" && (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-700 font-medium">Currently Working</span>
                </>
              )}
              {currentEntry?.status === "on_break" && (
                <>
                  <Coffee className="w-4 h-4 text-amber-500" />
                  <span className="text-slate-700 font-medium">On Break</span>
                </>
              )}
              {!currentEntry && (
                <>
                  <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                  <span className="text-slate-600 font-medium">Clocked Out</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <ClockControls
              currentEntry={currentEntry}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
              onBreakToggle={handleBreakToggle}
            />
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            <CurrentSession
              currentEntry={currentEntry}
              sessionDuration={getCurrentSessionDuration()}
              currentTime={currentTime}
            />
            
            <TodaySummary
              totalHours={getTotalHoursToday()}
              entries={todayEntries}
              currentTime={currentTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
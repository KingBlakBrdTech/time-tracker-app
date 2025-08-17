
import React, { useState, useEffect } from "react";
import { TimeEntry } from "@/entities/TimeEntry";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import TimesheetTable from "../components/timesheet/TimesheetTable";
import TimesheetStats from "../components/timesheet/TimesheetStats";

export default function Timesheet() {
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("month");
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [filteredEntries, setFilteredEntries] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    updateDateRange(activeTab);
  }, [activeTab]);

  useEffect(() => {
    filterEntries();
  }, [entries, dateRange]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      const allEntries = await TimeEntry.filter({ 
        created_by: userData.email 
      }, "-clock_in_time");
      
      setEntries(allEntries);
    } catch (error) {
      console.error("Error loading timesheet data:", error);
    }
    setIsLoading(false);
  };

  const updateDateRange = (period) => {
    const now = new Date();
    let start = null;
    let end = null;

    if (period === "week") {
      start = startOfWeek(now, { weekStartsOn: 1 }); 
      end = endOfWeek(now, { weekStartsOn: 1 });
    } else if (period === "month") {
      start = startOfMonth(now);
      end = endOfMonth(now);
    } else { // "all"
      start = null;
      end = null;
    }
    setDateRange({ start, end });
  };

  const filterEntries = () => {
    if (!dateRange.start && !dateRange.end) {
      setFilteredEntries(entries);
      return;
    }

    const filtered = entries.filter(entry => {
      if (!entry.clock_in_time) return false;
      const clockInDate = new Date(entry.clock_in_time);
      return clockInDate >= dateRange.start && clockInDate <= dateRange.end;
    });
    setFilteredEntries(filtered);
  };

  const getTotalHours = () => {
    return filteredEntries.reduce((sum, entry) => sum + (entry.total_hours || 0), 0);
  };

  const exportTimesheet = () => {
    const csvData = filteredEntries.map(entry => ({
      Date: entry.date,
      "Clock In": entry.clock_in_time ? format(new Date(entry.clock_in_time), "yyyy-MM-dd HH:mm:ss") : "",
      "Clock Out": entry.clock_out_time ? format(new Date(entry.clock_out_time), "yyyy-MM-dd HH:mm:ss") : "",
      Tasks: entry.tasks?.join('; ') || '',
      Location: entry.location || '',
      "Total Hours": entry.total_hours || 0,
      "Break Duration": entry.break_duration || 0,
      Status: entry.status,
      Notes: entry.notes || ""
    }));

    if (csvData.length === 0) {
      console.warn("No data to export.");
      return;
    }

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => {
        let value = row[header];
        if (value === null || value === undefined) {
          value = '';
        }
        value = String(value); 
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `timesheet-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-light text-white mb-2">Timesheet</h1>
            <p className="text-white/70">Track and review your work hours</p>
          </div>
          <Button
            onClick={exportTimesheet}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md"
            disabled={filteredEntries.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <TimesheetStats 
          entries={filteredEntries}
          totalHours={getTotalHours()}
          period={activeTab}
        />

        <Card className="glass-card border-0 shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-lg font-medium text-white">Time Entries</CardTitle>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-white/10 backdrop-blur-md">
                  <TabsTrigger value="week" className="data-[state=active]:bg-white/20">This Week</TabsTrigger>
                  <TabsTrigger value="month" className="data-[state=active]:bg-white/20">This Month</TabsTrigger>
                  <TabsTrigger value="all" className="data-[state=active]:bg-white/20">All Time</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <TimesheetTable entries={filteredEntries} /> 
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

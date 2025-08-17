
import React, { useState, useEffect } from "react";
import { TimeEntry } from "@/entities/TimeEntry";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Clock, Search, Download, Filter, Table, Calendar } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AdminTimeTable from "../components/admin/AdminTimeTable";
import AdminUserStats from "../components/admin/AdminUserStats";
import ActivityCalendar from "../components/admin/ActivityCalendar";

export default function AdminDashboard() {
  const [allEntries, setAllEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState("all");
  const [dateRange, setDateRange] = useState("week");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [allEntries, searchTerm, selectedUser, dateRange, selectedStatus]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setCurrentUser(userData);
      
      // Check if user is admin
      if (userData.role !== 'admin') {
        console.error("Access denied: Admin role required");
        return;
      }

      // Load all time entries
      const entries = await TimeEntry.list("-created_date");
      setAllEntries(entries);

      // Load all users
      const users = await User.list();
      setAllUsers(users);
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
    setIsLoading(false);
  };

  const filterEntries = () => {
    let filtered = [...allEntries];

    // Filter by search term (user name or email)
    if (searchTerm) {
      filtered = filtered.filter(entry => 
        entry.created_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
        allUsers.find(user => user.email === entry.created_by)?.full_name
          ?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected user
    if (selectedUser !== "all") {
      filtered = filtered.filter(entry => entry.created_by === selectedUser);
    }

    // Filter by date range
    const now = new Date();
    let startDate, endDate;
    
    switch (dateRange) {
      case "week":
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case "month":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case "all":
        startDate = new Date(0);
        endDate = now;
        break;
    }

    filtered = filtered.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(entry => entry.status === selectedStatus);
    }

    setFilteredEntries(filtered);
  };

  const exportAllData = () => {
    const csvData = filteredEntries.map(entry => {
      const user = allUsers.find(u => u.email === entry.created_by);
      return {
        "User Name": user?.full_name || "Unknown",
        "Email": entry.created_by,
        "Date": entry.date,
        "Clock In": entry.clock_in_time ? format(new Date(entry.clock_in_time), "yyyy-MM-dd HH:mm:ss") : "",
        "Clock Out": entry.clock_out_time ? format(new Date(entry.clock_out_time), "yyyy-MM-dd HH:mm:ss") : "",
        "Tasks": entry.tasks?.join('; ') || '',
        "Location": entry.location || '',
        "Total Hours": entry.total_hours || 0,
        "Break Duration": entry.break_duration || 0,
        "Status": entry.status,
        "Notes": entry.notes || ""
      };
    });

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `admin-timesheet-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check admin access
  if (!isLoading && currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
            <p className="text-slate-600">You need administrator privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-[#1B447E]" />
              <h1 className="text-3xl font-bold font-serif-display text-[#1B447E]">Admin Dashboard</h1>
            </div>
            <p className="text-slate-600">Monitor and manage all user time tracking data</p>
          </div>
          <Button
            onClick={exportAllData}
            className="bg-[#F3AF1C] hover:bg-amber-500 text-black"
            disabled={filteredEntries.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export All Data
          </Button>
        </div>

        <AdminUserStats entries={filteredEntries} users={allUsers} />

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Filter className="w-6 h-6 text-blue-600" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Users</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select User</label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {allUsers.map(user => (
                      <SelectItem key={user.email} value={user.email}>
                        {user.full_name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="clocked_in">Active</SelectItem>
                    <SelectItem value="on_break">On Break</SelectItem>
                    <SelectItem value="clocked_out">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100/80 mb-4">
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className="w-4 h-4" /> Data Table
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Calendar View
            </TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <AdminTimeTable entries={filteredEntries} users={allUsers} />
          </TabsContent>
          <TabsContent value="calendar">
            <ActivityCalendar entries={filteredEntries} users={allUsers} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
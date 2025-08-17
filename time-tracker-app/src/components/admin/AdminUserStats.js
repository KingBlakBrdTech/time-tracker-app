import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Calendar, Target } from "lucide-react";

export default function AdminUserStats({ entries, users }) {
  const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getTotalHours = () => {
    return entries.reduce((total, entry) => total + (entry.total_hours || 0), 0);
  };

  const getActiveUsers = () => {
    const activeUserEmails = new Set(entries.map(entry => entry.created_by));
    return activeUserEmails.size;
  };

  const getCompletedSessions = () => {
    return entries.filter(entry => entry.status === "clocked_out").length;
  };

  const getCurrentlyActive = () => {
    return entries.filter(entry => entry.status === "clocked_in").length;
  };

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      subtitle: `${getActiveUsers()} active`,
      icon: Users,
      color: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50"
    },
    {
      title: "Total Hours",
      value: formatHours(getTotalHours()),
      subtitle: "All time logged",
      icon: Clock,
      color: "from-green-500 to-emerald-500", 
      bg: "bg-green-50"
    },
    {
      title: "Sessions",
      value: entries.length,
      subtitle: `${getCompletedSessions()} completed`,
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-50"
    },
    {
      title: "Currently Active",
      value: getCurrentlyActive(),
      subtitle: "Users working now",
      icon: Target,
      color: "from-orange-500 to-red-500",
      bg: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
              </div>
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className="w-6 h-6 text-slate-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
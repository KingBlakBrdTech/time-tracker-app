import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, TrendingUp, Target } from "lucide-react";

export default function TimesheetStats({ entries, totalHours, period }) {
  const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getAverageHoursPerDay = () => {
    const workDays = entries.filter(entry => entry.total_hours > 0).length;
    return workDays > 0 ? totalHours / workDays : 0;
  };

  const getCompletedSessions = () => {
    return entries.filter(entry => entry.status === "clocked_out").length;
  };

  const stats = [
    {
      title: "Total Hours",
      value: formatHours(totalHours),
      icon: Clock,
    },
    {
      title: "Work Days",
      value: entries.filter(entry => entry.total_hours > 0).length,
      icon: Calendar,
    },
    {
      title: "Avg Hours/Day",
      value: formatHours(getAverageHoursPerDay()),
      icon: TrendingUp,
    },
    {
      title: "Completed Sessions",
      value: getCompletedSessions(),
      icon: Target,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="glass-card border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/60 mb-1">{stat.title}</p>
                <p className="text-xl font-semibold text-white">{stat.value}</p>
              </div>
              <div className="p-2 glass rounded-lg">
                <stat.icon className="w-5 h-5 text-white/70" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
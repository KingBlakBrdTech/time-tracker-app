
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Clock, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function TodaySummary({ totalHours, entries, currentTime }) {
  const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "clocked_in":
        return "bg-emerald-100 text-emerald-700"; // Changed for light background visibility
      case "on_break":
        return "bg-amber-100 text-amber-700"; // Changed for light background visibility
      case "clocked_out":
        return "bg-slate-100 text-slate-600"; // Changed for light background visibility
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <Card className="bg-white shadow-lg border border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          Today's Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-6">
          <div className="text-3xl font-mono font-bold text-slate-900 mb-2">
            {formatHours(totalHours)}
          </div>
          <p className="text-slate-600 font-medium">Total Hours Worked</p>
          <div className="mt-3 flex items-center justify-center gap-2 text-slate-500">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">
              {entries.length} session{entries.length !== 1 ? 's' : ''} today
            </span>
          </div>
        </div>

        {entries.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-slate-900 font-medium">Recent Sessions</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {entries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-900 font-medium">
                        {format(new Date(entry.clock_in_time), "h:mm a")}
                        {entry.clock_out_time && 
                          ` - ${format(new Date(entry.clock_out_time), "h:mm a")}`
                        }
                      </div>
                      {entry.location && (
                        <div className="text-sm text-slate-500 mt-1">
                          {entry.location}
                        </div>
                      )}
                    </div>
                    <Badge className={`${getStatusColor(entry.status)}`}>
                      {entry.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
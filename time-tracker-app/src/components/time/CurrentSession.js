
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Clock, Coffee, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function CurrentSession({ currentEntry, sessionDuration, currentTime }) {
  const formatDuration = (minutes) => {
    if (!minutes || isNaN(minutes) || minutes < 0) return "0h 0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!currentEntry) {
    return (
      <Card className="bg-white shadow-lg border border-slate-200">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center text-slate-500">
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No Active Session</p>
            <p className="text-slate-400">Clock in to start tracking time</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg border border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
          <Timer className="w-6 h-6 text-blue-600" />
          Current Session
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-6">
          <div className="text-4xl font-mono font-bold text-slate-900 mb-2">
            {formatDuration(sessionDuration)}
          </div>
          <p className="text-slate-600 font-medium">Session Duration</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-slate-500" />
              <span className="text-slate-600 font-medium">Started At</span>
            </div>
            <div className="text-xl font-semibold text-slate-900">
              {format(new Date(currentEntry.clock_in_time), "h:mm a")}
            </div>
          </div>

          {currentEntry.location && (
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-slate-500" />
                <span className="text-slate-600 font-medium">Location</span>
              </div>
              <div className="text-lg font-medium text-slate-900">
                {currentEntry.location}
              </div>
            </div>
          )}
        </div>

        {currentEntry.status === "on_break" && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-3 text-amber-800">
              <Coffee className="w-5 h-5" />
              <span className="font-medium">Currently on break</span>
            </div>
          </div>
        )}

        {currentEntry.tasks && currentEntry.tasks.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-4">
            <h4 className="text-slate-900 font-medium mb-3">Current Tasks</h4>
            <div className="flex flex-wrap gap-2">
              {currentEntry.tasks.map((task, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-lg font-medium"
                >
                  {task}
                </span>
              ))}
            </div>
          </div>
        )}

        {currentEntry.notes && (
          <div className="bg-slate-50 rounded-xl p-4">
            <h4 className="text-slate-900 font-medium mb-2">Session Notes</h4>
            <p className="text-slate-600 leading-relaxed">{currentEntry.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

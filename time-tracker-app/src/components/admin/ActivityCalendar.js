import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, User, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameDay, isSameMonth, isToday } from 'date-fns';
import { groupBy, sumBy } from 'lodash';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ActivityCalendar({ entries, users }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const entriesByDay = useMemo(() => {
    return groupBy(entries, entry => format(new Date(entry.date), 'yyyy-MM-dd'));
  }, [entries]);

  const usersById = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[user.email] = user;
      return acc;
    }, {});
  }, [users]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startingDayIndex = (monthStart.getDay() + 6) % 7; // Monday is 0

  const formatHours = (hours) => {
    if (!hours) return "0h";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getUserInitials = (email) => {
    const user = usersById[email];
    if (user?.full_name) {
      const parts = user.full_name.split(' ');
      return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].substring(0, 2);
    }
    return email ? email[0].toUpperCase() : '?';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Activity Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-slate-800 w-32 text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center font-semibold text-sm text-slate-500 pb-2">{day}</div>
          ))}
          {Array.from({ length: startingDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="border border-slate-100 rounded-md bg-slate-50/50"></div>
          ))}
          {days.map(day => {
            const dayString = format(day, 'yyyy-MM-dd');
            const dayEntries = entriesByDay[dayString] || [];
            const totalHours = sumBy(dayEntries, 'total_hours');
            const activeUsers = [...new Set(dayEntries.map(e => e.created_by))];

            return (
              <div
                key={day.toString()}
                className={`border rounded-md p-2 flex flex-col min-h-[120px] transition-colors ${
                  isToday(day) ? 'bg-blue-50 border-blue-200' : 'border-slate-200 bg-white'
                }`}
              >
                <time dateTime={dayString} className={`font-semibold ${isToday(day) ? 'text-blue-600' : 'text-slate-700'}`}>
                  {format(day, 'd')}
                </time>
                {dayEntries.length > 0 && (
                  <div className="mt-2 space-y-2 flex-1">
                    <div className="flex items-center gap-1 text-sm font-bold text-slate-800">
                      <Clock className="w-3 h-3" />
                      {formatHours(totalHours)}
                    </div>
                    <TooltipProvider>
                      <div className="flex flex-wrap gap-1">
                        {activeUsers.slice(0, 5).map(email => (
                          <Tooltip key={email}>
                            <TooltipTrigger asChild>
                              <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                                {getUserInitials(email)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{usersById[email]?.full_name || email}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                        {activeUsers.length > 5 && (
                           <div className="w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center text-xs font-bold text-slate-700">
                             +{activeUsers.length - 5}
                           </div>
                        )}
                      </div>
                    </TooltipProvider>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
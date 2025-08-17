
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, Coffee, CheckCircle, Users } from "lucide-react";

export default function AdminTimeTable({ entries, users }) {
  const formatHours = (hours) => {
    if (!hours) return "0h 0m";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      clocked_in: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: Clock,
        label: "Active"
      },
      on_break: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: Coffee,
        label: "On Break"
      },
      clocked_out: {
        color: "bg-slate-100 text-slate-600 border-slate-200",
        icon: CheckCircle,
        label: "Complete"
      }
    };

    const config = statusConfig[status] || statusConfig.clocked_out;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getUserName = (email) => {
    const user = users.find(u => u.email === email);
    if (user?.full_name) {
      return user.full_name;
    }
    // Fallback if full_name is not present
    if (email) {
      return email.split('@')[0];
    }
    return "Unknown User";
  };

  if (entries.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No entries found</h3>
            <p className="text-slate-500">Time entries will appear here based on your filters.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <Users className="w-6 h-6 text-blue-600" />
          All User Time Entries ({entries.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Time</TableHead>
                <TableHead className="font-semibold">Tasks</TableHead>
                <TableHead className="font-semibold">Branch</TableHead>
                <TableHead className="font-semibold">Total Hours</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold text-slate-900">{getUserName(entry.created_by)}</div>
                      <div className="text-xs text-slate-500">{entry.created_by}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(entry.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {entry.clock_in_time ? format(new Date(entry.clock_in_time), "h:mm a") : "-"}
                      {entry.clock_out_time ? (
                        <div className="text-slate-500">
                          to {format(new Date(entry.clock_out_time), "h:mm a")}
                        </div>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {entry.tasks?.join(', ') || "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {entry.location || "-"}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatHours(entry.total_hours)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(entry.status)}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate" title={entry.notes}>
                    {entry.notes || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
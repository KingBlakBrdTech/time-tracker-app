import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, CheckCircle } from "lucide-react";

export default function TimesheetTable({ entries }) {
  const formatHours = (hours) => {
    if (!hours) return "0h 0m";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      clocked_in: {
        color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        icon: Clock,
        label: "Active"
      },
      clocked_out: {
        color: "bg-white/10 text-white/70 border-white/20",
        icon: CheckCircle,
        label: "Complete"
      }
    };

    const config = statusConfig[status] || statusConfig.clocked_out;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border backdrop-blur-sm`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-10 h-10 mx-auto mb-4 text-white/40" />
        <h3 className="text-lg font-medium text-white/70 mb-2">No time entries found</h3>
        <p className="text-white/50">Time entries will appear here once you start tracking time.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10">
            <TableHead className="font-medium text-white/90">Date</TableHead>
            <TableHead className="font-medium text-white/90">Time</TableHead>
            <TableHead className="font-medium text-white/90">Tasks</TableHead>
            <TableHead className="font-medium text-white/90">Location</TableHead>
            <TableHead className="font-medium text-white/90">Hours</TableHead>
            <TableHead className="font-medium text-white/90">Status</TableHead>
            <TableHead className="font-medium text-white/90">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id} className="border-white/5 hover:bg-white/5 transition-colors">
              <TableCell className="font-medium text-white/80">
                {format(new Date(entry.date), "MMM d")}
              </TableCell>
              <TableCell className="text-white/70">
                <div className="text-sm">
                  {entry.clock_in_time ? format(new Date(entry.clock_in_time), "h:mm a") : "-"}
                  {entry.clock_out_time && (
                    <div className="text-white/50">
                      to {format(new Date(entry.clock_out_time), "h:mm a")}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="max-w-[150px] truncate text-white/70">
                {entry.tasks?.join(', ') || "-"}
              </TableCell>
              <TableCell className="text-white/70">
                {entry.location}
              </TableCell>
              <TableCell className="font-medium text-white/80">
                {formatHours(entry.total_hours)}
              </TableCell>
              <TableCell>
                {getStatusBadge(entry.status)}
              </TableCell>
              <TableCell className="max-w-[150px] truncate text-white/60" title={entry.notes}>
                {entry.notes || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
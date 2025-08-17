
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Play, Square, Coffee, PlayCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const TASKS = ["Teaching", "Admin", "Planning", "Other"];
const LOCATIONS = [
  "Virgin Mary Mosque",
  "Australian Islamic Centre", 
  "Maidstone Mosque",
  "Circles of Light Centre",
  "Remote"
];

export default function ClockControls({ 
  currentEntry, 
  onClockIn, 
  onClockOut, 
  onBreakToggle 
}) {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (currentEntry) {
      setSelectedTasks(currentEntry.tasks || []);
      setLocation(currentEntry.location || "");
      setNotes(currentEntry.notes || "");
    } else {
      setSelectedTasks([]);
      setLocation("");
      setNotes("");
    }
  }, [currentEntry]);

  const handleTaskChange = (task) => {
    setSelectedTasks(prev => 
      prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task]
    );
  };
  
  const handleClockInAction = async () => {
    setIsProcessing(true);
    await onClockIn({ tasks: selectedTasks, location, notes });
    setIsProcessing(false);
  };

  const handleClockOutAction = async () => {
    setIsProcessing(true);
    await onClockOut({ notes });
    setIsProcessing(false);
  };

  const handleBreakAction = async () => {
    setIsProcessing(true);
    await onBreakToggle();
    setIsProcessing(false);
  };

  return (
    <Card className="bg-white shadow-lg border border-slate-200">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold text-slate-900">Time Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <fieldset className="space-y-4" disabled={!!currentEntry}>
          <legend className="text-slate-700 font-medium text-base mb-3">Select Tasks</legend>
          <div className="space-y-3">
            {TASKS.map(task => (
              <div key={task} className="flex items-center space-x-3">
                <Checkbox
                  id={`task-${task}`}
                  checked={selectedTasks.includes(task)}
                  onCheckedChange={() => handleTaskChange(task)}
                  className="border-slate-300"
                />
                <Label htmlFor={`task-${task}`} className="text-slate-700 font-medium cursor-pointer">
                  {task}
                </Label>
              </div>
            ))}
          </div>
        </fieldset>

        <div className="space-y-3">
          <Label className="text-slate-700 font-medium text-base">Location</Label>
          <Select onValueChange={setLocation} value={location} disabled={!!currentEntry}>
            <SelectTrigger className="h-11 border-slate-300">
              <SelectValue placeholder="Choose your location..." />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map(loc => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-slate-700 font-medium text-base">Notes</Label>
          <Textarea
            placeholder="Add notes about your session..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-20 resize-none border-slate-300"
          />
        </div>

        <div className="space-y-3 pt-4">
          {!currentEntry ? (
            <Button
              onClick={handleClockInAction}
              disabled={isProcessing || !location || selectedTasks.length === 0}
              className="w-full h-12 text-base font-medium bg-green-600 hover:bg-green-700 text-white rounded-xl"
            >
              <Play className="w-5 h-5 mr-2" />
              Clock In
            </Button>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={handleClockOutAction}
                disabled={isProcessing}
                className="w-full h-12 text-base font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                <Square className="w-5 h-5 mr-2" />
                Clock Out
              </Button>

              <Button
                onClick={handleBreakAction}
                disabled={isProcessing}
                variant="outline"
                className={`w-full h-11 text-sm font-medium rounded-xl ${
                  currentEntry?.status === "on_break" 
                    ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" 
                    : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                }`}
              >
                {currentEntry?.status === "on_break" ? (
                  <>
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Resume Work
                  </>
                ) : (
                  <>
                    <Coffee className="w-4 h-4 mr-2" />
                    Take Break
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

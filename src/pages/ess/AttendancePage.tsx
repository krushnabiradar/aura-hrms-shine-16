
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { Clock, CalendarDays, Play, Square, Timer } from "lucide-react";

const attendanceData = [
  { date: "2024-01-24", clockIn: "09:00 AM", clockOut: "05:30 PM", hours: "8.5", status: "Present" },
  { date: "2024-01-23", clockIn: "09:15 AM", clockOut: "05:45 PM", hours: "8.5", status: "Present" },
  { date: "2024-01-22", clockIn: "09:00 AM", clockOut: "05:00 PM", hours: "8.0", status: "Present" },
  { date: "2024-01-21", clockIn: "-", clockOut: "-", hours: "0", status: "Absent" },
  { date: "2024-01-20", clockIn: "08:45 AM", clockOut: "05:15 PM", hours: "8.5", status: "Present" },
];

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState("09:00 AM");

  const handleClockIn = () => {
    setIsClockedIn(true);
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    toast.success("Clocked in successfully");
  };

  const handleClockOut = () => {
    setIsClockedIn(false);
    toast.success("Clocked out successfully");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Present":
        return <Badge variant="default" className="bg-green-100 text-green-800">Present</Badge>;
      case "Absent":
        return <Badge variant="destructive">Absent</Badge>;
      case "Late":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Late</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
        <p className="text-muted-foreground">Track your daily attendance and view your history</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32h</div>
            <p className="text-xs text-muted-foreground">+2h from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">160h</div>
            <p className="text-xs text-muted-foreground">Target: 168h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <div className={`h-2 w-2 rounded-full ${isClockedIn ? 'bg-green-500' : 'bg-gray-400'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isClockedIn ? 'In' : 'Out'}</div>
            <p className="text-xs text-muted-foreground">Since {currentTime}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Time Tracking</CardTitle>
            <CardDescription>Clock in and out for your work day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              {!isClockedIn ? (
                <Button onClick={handleClockIn} size="lg" className="h-16 px-8">
                  <Play className="h-6 w-6 mr-2" />
                  Clock In
                </Button>
              ) : (
                <Button onClick={handleClockOut} variant="destructive" size="lg" className="h-16 px-8">
                  <Square className="h-6 w-6 mr-2" />
                  Clock Out
                </Button>
              )}
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-mono font-bold">
                {new Date().toLocaleTimeString()}
              </div>
              <p className="text-muted-foreground mt-2">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view details</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>Your recent attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {new Date(record.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{record.clockIn}</TableCell>
                  <TableCell>{record.clockOut}</TableCell>
                  <TableCell>{record.hours}h</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

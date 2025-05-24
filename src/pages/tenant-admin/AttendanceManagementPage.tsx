
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/components/ui/sonner";
import { Clock, Users, CheckCircle, XCircle, AlertCircle, Calendar as CalendarIcon } from "lucide-react";

const mockAttendanceData = [
  { 
    id: "att-001", 
    employee: "Alice Johnson", 
    date: "2024-01-24", 
    clockIn: "09:00 AM", 
    clockOut: "05:30 PM", 
    hours: 8.5, 
    status: "Present",
    overtime: 0.5
  },
  { 
    id: "att-002", 
    employee: "Bob Smith", 
    date: "2024-01-24", 
    clockIn: "09:15 AM", 
    clockOut: "05:45 PM", 
    hours: 8.5, 
    status: "Late",
    overtime: 0.5
  },
  { 
    id: "att-003", 
    employee: "Carol White", 
    date: "2024-01-24", 
    clockIn: "-", 
    clockOut: "-", 
    hours: 0, 
    status: "Absent",
    overtime: 0
  },
  { 
    id: "att-004", 
    employee: "Dave Miller", 
    date: "2024-01-24", 
    clockIn: "08:45 AM", 
    clockOut: "05:15 PM", 
    hours: 8.5, 
    status: "Present",
    overtime: 0
  }
];

const mockSchedules = [
  { employee: "Alice Johnson", shift: "9:00 AM - 5:00 PM", days: "Mon-Fri" },
  { employee: "Bob Smith", shift: "9:00 AM - 5:00 PM", days: "Mon-Fri" },
  { employee: "Carol White", shift: "10:00 AM - 6:00 PM", days: "Mon-Fri" },
  { employee: "Dave Miller", shift: "8:00 AM - 4:00 PM", days: "Mon-Fri" }
];

export default function AttendanceManagementPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Present":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Present</Badge>;
      case "Absent":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Absent</Badge>;
      case "Late":
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Late</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalEmployees = mockAttendanceData.length;
  const presentToday = mockAttendanceData.filter(a => a.status === "Present" || a.status === "Late").length;
  const absentToday = mockAttendanceData.filter(a => a.status === "Absent").length;
  const lateToday = mockAttendanceData.filter(a => a.status === "Late").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Attendance Management</h2>
        <p className="text-muted-foreground">Monitor and manage company-wide attendance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active workforce</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentToday}</div>
            <p className="text-xs text-muted-foreground">{((presentToday/totalEmployees)*100).toFixed(1)}% attendance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentToday}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lateToday}</div>
            <p className="text-xs text-muted-foreground">Today's late check-ins</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
          <TabsTrigger value="schedules">Work Schedules</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Today's Attendance</CardTitle>
                <CardDescription>Real-time attendance tracking for {new Date().toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Clock In</TableHead>
                      <TableHead>Clock Out</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAttendanceData.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.employee}</TableCell>
                        <TableCell>{record.clockIn}</TableCell>
                        <TableCell>{record.clockOut}</TableCell>
                        <TableCell>{record.hours}h</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast.info(`Reviewing attendance for ${record.employee}`)}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Select date to view attendance</CardDescription>
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
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Work Schedules</CardTitle>
              <CardDescription>Manage employee work schedules and shifts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Shift Hours</TableHead>
                    <TableHead>Working Days</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSchedules.map((schedule, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{schedule.employee}</TableCell>
                      <TableCell>{schedule.shift}</TableCell>
                      <TableCell>{schedule.days}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info("Schedule edit functionality not implemented yet")}
                        >
                          Edit Schedule
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Summary</CardTitle>
                <CardDescription>Attendance metrics for this week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Average Attendance Rate</span>
                  <span className="font-semibold">92.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Hours Logged</span>
                  <span className="font-semibold">1,286h</span>
                </div>
                <div className="flex justify-between">
                  <span>Overtime Hours</span>
                  <span className="font-semibold">23h</span>
                </div>
                <div className="flex justify-between">
                  <span>Late Arrivals</span>
                  <span className="font-semibold">7</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Reports</CardTitle>
                <CardDescription>Generate attendance reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full"
                  onClick={() => toast.info("Daily report export not implemented yet")}
                >
                  Export Daily Report
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => toast.info("Weekly report export not implemented yet")}
                >
                  Export Weekly Report
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => toast.info("Monthly report export not implemented yet")}
                >
                  Export Monthly Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

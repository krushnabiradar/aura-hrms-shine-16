
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/components/ui/sonner";
import { CalendarDays, Clock, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react";

const mockLeaveRequests = [
  {
    id: "leave-001",
    employee: "Alice Johnson",
    type: "Annual Leave",
    startDate: "2024-02-01",
    endDate: "2024-02-05",
    days: 5,
    status: "Pending",
    reason: "Family vacation",
    appliedDate: "2024-01-15"
  },
  {
    id: "leave-002", 
    employee: "Bob Smith",
    type: "Sick Leave",
    startDate: "2024-01-22",
    endDate: "2024-01-22",
    days: 1,
    status: "Approved",
    reason: "Medical appointment",
    appliedDate: "2024-01-20"
  },
  {
    id: "leave-003",
    employee: "Carol White", 
    type: "Maternity Leave",
    startDate: "2024-03-01",
    endDate: "2024-05-30",
    days: 90,
    status: "Approved",
    reason: "Maternity leave",
    appliedDate: "2024-01-10"
  },
  {
    id: "leave-004",
    employee: "Dave Miller",
    type: "Annual Leave",
    startDate: "2024-01-29",
    endDate: "2024-01-31",
    days: 3,
    status: "Rejected",
    reason: "Personal reasons",
    appliedDate: "2024-01-25"
  }
];

const mockLeaveBalances = [
  { employee: "Alice Johnson", annualLeave: 15, sickLeave: 10, personalLeave: 5 },
  { employee: "Bob Smith", annualLeave: 18, sickLeave: 12, personalLeave: 3 },
  { employee: "Carol White", annualLeave: 20, sickLeave: 8, personalLeave: 7 },
  { employee: "Dave Miller", annualLeave: 12, sickLeave: 15, personalLeave: 4 }
];

const mockLeavePolicies = [
  { type: "Annual Leave", entitlement: 20, carryover: 5, maxConsecutive: 15 },
  { type: "Sick Leave", entitlement: 15, carryover: 0, maxConsecutive: 30 },
  { type: "Personal Leave", entitlement: 5, carryover: 2, maxConsecutive: 3 },
  { type: "Maternity Leave", entitlement: 90, carryover: 0, maxConsecutive: 90 }
];

export default function LeaveAdministrationPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "Rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingRequests = mockLeaveRequests.filter(req => req.status === "Pending").length;
  const approvedThisMonth = mockLeaveRequests.filter(req => req.status === "Approved").length;
  const totalDaysRequested = mockLeaveRequests.reduce((sum, req) => sum + req.days, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Leave Administration</h2>
        <p className="text-muted-foreground">Manage leave requests, policies, and employee balances</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedThisMonth}</div>
            <p className="text-xs text-muted-foreground">Processed requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days Requested</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDaysRequested}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">Average leave usage</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="balances">Employee Balances</TabsTrigger>
          <TabsTrigger value="policies">Leave Policies</TabsTrigger>
          <TabsTrigger value="calendar">Leave Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>Review and approve employee leave requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.employee}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>{new Date(request.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(request.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>{request.days}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {request.status === "Pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => toast.success(`Approved leave for ${request.employee}`)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toast.error(`Rejected leave for ${request.employee}`)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast.info(`Viewing details for ${request.employee}'s request`)}
                          >
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Leave Balances</CardTitle>
              <CardDescription>Current leave entitlements and remaining balances</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Annual Leave</TableHead>
                    <TableHead>Sick Leave</TableHead>
                    <TableHead>Personal Leave</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeaveBalances.map((balance, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{balance.employee}</TableCell>
                      <TableCell>{balance.annualLeave} days</TableCell>
                      <TableCell>{balance.sickLeave} days</TableCell>
                      <TableCell>{balance.personalLeave} days</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info("Adjust balance functionality not implemented yet")}
                        >
                          Adjust
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Policies</CardTitle>
              <CardDescription>Configure leave types and entitlements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Annual Entitlement</TableHead>
                    <TableHead>Carryover Days</TableHead>
                    <TableHead>Max Consecutive</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeavePolicies.map((policy, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{policy.type}</TableCell>
                      <TableCell>{policy.entitlement} days</TableCell>
                      <TableCell>{policy.carryover} days</TableCell>
                      <TableCell>{policy.maxConsecutive} days</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info("Edit policy functionality not implemented yet")}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Company Leave Calendar</CardTitle>
                <CardDescription>Overview of scheduled leaves across the organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLeaveRequests.filter(req => req.status === "Approved").map((leave) => (
                    <div key={leave.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{leave.employee}</h4>
                        <p className="text-sm text-muted-foreground">{leave.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{leave.days} days</p>
                        {getStatusBadge(leave.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>Select date to view details</CardDescription>
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
      </Tabs>
    </div>
  );
}

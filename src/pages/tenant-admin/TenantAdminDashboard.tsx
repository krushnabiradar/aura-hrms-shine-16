
import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  DollarSign,
  Briefcase,
  BarChart3,
  Clock,
  UserCheck,
  FileText
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { TenantAdminSidebar } from "@/components/sidebars/TenantAdminSidebar";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";

// Mock data
const recentEmployees = [
  { 
    id: "emp1", 
    name: "Alice Johnson", 
    position: "Software Developer", 
    department: "Engineering",
    joinDate: "2023-05-01", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" 
  },
  { 
    id: "emp2", 
    name: "Bob Smith", 
    position: "UX Designer", 
    department: "Design",
    joinDate: "2023-05-03", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" 
  },
  { 
    id: "emp3", 
    name: "Carol White", 
    position: "Project Manager", 
    department: "Management",
    joinDate: "2023-05-05", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol" 
  },
  { 
    id: "emp4", 
    name: "Dave Miller", 
    position: "Marketing Specialist", 
    department: "Marketing",
    joinDate: "2023-05-10", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dave" 
  },
];

const pendingRequests = [
  { id: 1, type: "Leave Request", employee: "Alice Johnson", submitted: "2023-05-12", status: "Pending" },
  { id: 2, type: "Expense Claim", employee: "Bob Smith", submitted: "2023-05-11", status: "Pending" },
  { id: 3, type: "Leave Request", employee: "Carol White", submitted: "2023-05-10", status: "Pending" },
];

const TenantAdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulating data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAddEmployee = () => {
    toast.info("Add employee functionality not implemented yet");
  };

  return (
    <DashboardLayout sidebar={<TenantAdminSidebar />}>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">HR Dashboard</h2>
          <p className="text-muted-foreground">Manage your organization's human resources.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Employees"
            value={isLoading ? "Loading..." : "126"}
            icon={Users}
            trend={3.2}
            trendLabel="from last month"
          />
          <DashboardCard
            title="Leave Requests"
            value={isLoading ? "Loading..." : "8"}
            icon={Calendar}
            trend={-2.5}
            trendLabel="from last month"
          />
          <DashboardCard
            title="Payroll Status"
            value={isLoading ? "Loading..." : "Processed"}
            icon={DollarSign}
            description="Next run: May 30, 2023"
          />
          <DashboardCard
            title="Open Positions"
            value={isLoading ? "Loading..." : "5"}
            icon={Briefcase}
            trend={25}
            trendLabel="from last month"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recently Added Employees</CardTitle>
                <CardDescription>
                  New employees added in the last 30 days.
                </CardDescription>
              </div>
              <Button onClick={handleAddEmployee}>Add Employee</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Join Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Loading employee data...
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={employee.avatar} alt={employee.name} />
                              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{employee.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.joinDate}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                Requests waiting for your review
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading requests...</div>
              ) : pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="flex items-start justify-between p-3 border rounded-md">
                      <div>
                        <h4 className="font-medium">{request.type}</h4>
                        <p className="text-sm text-muted-foreground">By {request.employee}</p>
                        <p className="text-xs text-muted-foreground">Submitted on {request.submitted}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info(`Viewing ${request.type} from ${request.employee}`)}
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No pending requests
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>Daily attendance statistics</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <UserCheck className="h-16 w-16" />
                <p>Attendance chart will appear here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Scheduled company events</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading events...</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 border rounded-md">
                    <div className="bg-primary/10 p-2 rounded">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Company Town Hall</h4>
                      <p className="text-sm text-muted-foreground">May 25, 2023 • 3:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-md">
                    <div className="bg-primary/10 p-2 rounded">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Quarterly Review</h4>
                      <p className="text-sm text-muted-foreground">May 28, 2023 • 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-md">
                    <div className="bg-primary/10 p-2 rounded">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Performance Reviews Due</h4>
                      <p className="text-sm text-muted-foreground">May 30, 2023</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TenantAdminDashboard;

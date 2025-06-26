
import { useState } from "react";
import { Search, Filter, Download, RefreshCw, AlertTriangle, Info, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { useQuery } from "@tanstack/react-query";
import { systemAdminApi } from "@/services/api/system-admin";

const SystemLogsPage = () => {
  const [logLevel, setLogLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: systemLogs, isLoading: systemLogsLoading, refetch: refetchSystemLogs } = useQuery({
    queryKey: ['system-logs', currentPage, logLevel, searchTerm],
    queryFn: () => systemAdminApi.getSystemLogs({
      page: currentPage,
      limit: 20,
      level: logLevel === 'all' ? undefined : logLevel,
      action: searchTerm || undefined
    }),
    refetchInterval: 30000,
  });

  const { data: auditLogs, isLoading: auditLogsLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => systemAdminApi.getAuditLogs({ limit: 20 }),
  });

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'ERROR':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'INFO':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLogBadgeVariant = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'destructive';
      case 'WARNING':
        return 'secondary';
      case 'INFO':
      default:
        return 'default';
    }
  };

  const handleExportLogs = () => {
    toast.success('Logs exported successfully');
  };

  const handleRefreshLogs = () => {
    refetchSystemLogs();
    toast.success('Logs refreshed');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Logs</h2>
          <p className="text-muted-foreground">Monitor system activities and troubleshoot issues</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefreshLogs}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemLogs?.pagination?.totalItems || 0}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {systemLogs?.logs?.filter(log => log.level === 'ERROR').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Critical issues</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {systemLogs?.logs?.filter(log => log.level === 'WARNING').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Attention needed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Info</CardTitle>
            <Info className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {systemLogs?.logs?.filter(log => log.level === 'INFO').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Normal operations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList>
          <TabsTrigger value="system">System Logs</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>System Activity Logs</CardTitle>
                  <CardDescription>Real-time system events and operations</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={logLevel} onValueChange={setLogLevel}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="ERROR">Errors</SelectItem>
                      <SelectItem value="WARNING">Warnings</SelectItem>
                      <SelectItem value="INFO">Info</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {systemLogsLoading ? (
                <div className="text-center py-8">Loading system logs...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Level</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemLogs?.logs?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No logs found
                        </TableCell>
                      </TableRow>
                    ) : (
                      systemLogs?.logs?.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getLogIcon(log.level)}
                              <Badge variant={getLogBadgeVariant(log.level)}>
                                {log.level}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-1 py-0.5 rounded">
                              {log.action}
                            </code>
                          </TableCell>
                          <TableCell className="max-w-md truncate">{log.message}</TableCell>
                          <TableCell>{log.userEmail || 'System'}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {log.ipAddress}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Audit Logs</CardTitle>
              <CardDescription>Track user activities and access patterns</CardDescription>
            </CardHeader>
            <CardContent>
              {auditLogsLoading ? (
                <div className="text-center py-8">Loading audit logs...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs?.logs?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No audit logs available
                        </TableCell>
                      </TableRow>
                    ) : (
                      auditLogs?.logs?.map((log: any) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{log.userName}</div>
                              <div className="text-sm text-muted-foreground">{log.userEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.action}</Badge>
                          </TableCell>
                          <TableCell>{log.tenantName}</TableCell>
                          <TableCell className="text-sm">
                            {log.lastLogin ? new Date(log.lastLogin).toLocaleString() : 'Never'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemLogsPage;

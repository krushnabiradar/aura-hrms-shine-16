
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Download, Play, Save, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

interface ReportConfig {
  name: string;
  description: string;
  dataSource: string;
  fields: string[];
  filters: {
    dateRange: {
      from: Date | undefined;
      to: Date | undefined;
    };
    department?: string;
    status?: string;
  };
  groupBy: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  format: 'table' | 'chart' | 'summary';
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
}

const dataSources = [
  { value: 'employees', label: 'Employees' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'leave', label: 'Leave Requests' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'performance', label: 'Performance Reviews' },
];

const availableFields = {
  employees: ['id', 'name', 'email', 'department', 'position', 'hire_date', 'salary', 'status'],
  attendance: ['employee_name', 'date', 'check_in', 'check_out', 'hours_worked', 'status'],
  leave: ['employee_name', 'type', 'start_date', 'end_date', 'days', 'status', 'reason'],
  payroll: ['employee_name', 'period', 'basic_salary', 'overtime', 'deductions', 'net_pay'],
  performance: ['employee_name', 'period', 'rating', 'goals_met', 'manager_feedback'],
};

export function ReportBuilder() {
  const [config, setConfig] = useState<ReportConfig>({
    name: '',
    description: '',
    dataSource: '',
    fields: [],
    filters: {
      dateRange: {
        from: undefined,
        to: undefined,
      },
    },
    groupBy: [],
    sortBy: '',
    sortOrder: 'asc',
    format: 'table',
    schedule: {
      enabled: false,
      frequency: 'weekly',
      recipients: [],
    },
  });

  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateConfig = (key: keyof ReportConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateFilter = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value
      }
    }));
  };

  const toggleField = (field: string) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.includes(field)
        ? prev.fields.filter(f => f !== field)
        : [...prev.fields, field]
    }));
  };

  const generatePreview = async () => {
    if (!config.dataSource || config.fields.length === 0) {
      toast.error("Please select a data source and at least one field");
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockData = Array.from({ length: 10 }, (_, i) => {
        const row: any = {};
        config.fields.forEach(field => {
          row[field] = `Sample ${field} ${i + 1}`;
        });
        return row;
      });
      
      setPreviewData(mockData);
      setIsGenerating(false);
      toast.success("Report preview generated successfully");
    }, 1500);
  };

  const saveReport = () => {
    if (!config.name) {
      toast.error("Please enter a report name");
      return;
    }
    toast.success(`Report "${config.name}" saved successfully`);
  };

  const exportReport = (format: 'csv' | 'pdf' | 'excel') => {
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Report Builder</h2>
        <p className="text-muted-foreground">
          Create custom reports with flexible filtering and formatting options
        </p>
      </div>

      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="preview">Preview & Export</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Set up the basic details for your report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="report-name">Report Name</Label>
                  <Input
                    id="report-name"
                    placeholder="Enter report name"
                    value={config.name}
                    onChange={(e) => updateConfig('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data-source">Data Source</Label>
                  <Select value={config.dataSource} onValueChange={(value) => updateConfig('dataSource', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data source" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSources.map((source) => (
                        <SelectItem key={source.value} value={source.value}>
                          {source.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Describe what this report shows"
                  value={config.description}
                  onChange={(e) => updateConfig('description', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {config.dataSource && (
            <Card>
              <CardHeader>
                <CardTitle>Fields</CardTitle>
                <CardDescription>
                  Select the fields to include in your report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availableFields[config.dataSource as keyof typeof availableFields]?.map((field) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox
                        id={field}
                        checked={config.fields.includes(field)}
                        onCheckedChange={() => toggleField(field)}
                      />
                      <Label htmlFor={field} className="capitalize">
                        {field.replace(/_/g, ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Filters & Options</CardTitle>
              <CardDescription>
                Configure filters and display options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !config.filters.dateRange.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {config.filters.dateRange.from ? (
                            format(config.filters.dateRange.from, "PPP")
                          ) : (
                            "From date"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={config.filters.dateRange.from}
                          onSelect={(date) => updateFilter('dateRange', {
                            ...config.filters.dateRange,
                            from: date
                          })}
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !config.filters.dateRange.to && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {config.filters.dateRange.to ? (
                            format(config.filters.dateRange.to, "PPP")
                          ) : (
                            "To date"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={config.filters.dateRange.to}
                          onSelect={(date) => updateFilter('dateRange', {
                            ...config.filters.dateRange,
                            to: date
                          })}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">Display Format</Label>
                  <Select value={config.format} onValueChange={(value) => updateConfig('format', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="table">Table</SelectItem>
                      <SelectItem value="chart">Chart</SelectItem>
                      <SelectItem value="summary">Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>
                Generate a preview of your report with current settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={generatePreview} disabled={isGenerating}>
                  <Play className="mr-2 h-4 w-4" />
                  {isGenerating ? 'Generating...' : 'Generate Preview'}
                </Button>
                <Button variant="outline" onClick={saveReport}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Report
                </Button>
              </div>

              {previewData.length > 0 && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportReport('csv')}>
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportReport('pdf')}>
                      <Download className="mr-2 h-4 w-4" />
                      Export PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportReport('excel')}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Excel
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            {config.fields.map((field) => (
                              <th key={field} className="px-4 py-2 text-left font-medium">
                                {field.replace(/_/g, ' ').toUpperCase()}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((row, index) => (
                            <tr key={index} className="border-t">
                              {config.fields.map((field) => (
                                <td key={field} className="px-4 py-2">
                                  {row[field]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Scheduling</CardTitle>
              <CardDescription>
                Automatically generate and send reports on a schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable-schedule"
                  checked={config.schedule?.enabled}
                  onCheckedChange={(checked) => updateConfig('schedule', {
                    ...config.schedule,
                    enabled: checked
                  })}
                />
                <Label htmlFor="enable-schedule">Enable automatic scheduling</Label>
              </div>

              {config.schedule?.enabled && (
                <div className="space-y-4 pl-6">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={config.schedule.frequency}
                      onValueChange={(value) => updateConfig('schedule', {
                        ...config.schedule,
                        frequency: value
                      })}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipients">Email Recipients</Label>
                    <Input
                      id="recipients"
                      placeholder="Enter email addresses separated by commas"
                      value={config.schedule.recipients.join(', ')}
                      onChange={(e) => updateConfig('schedule', {
                        ...config.schedule,
                        recipients: e.target.value.split(',').map(email => email.trim())
                      })}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

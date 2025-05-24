
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Upload, Save, Trash2, Shield, Database, Mail, Globe } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface SystemConfig {
  general: {
    companyName: string;
    companyLogo: string;
    timezone: string;
    dateFormat: string;
    currency: string;
    language: string;
  };
  security: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      expiryDays: number;
    };
    sessionTimeout: number;
    twoFactorAuth: boolean;
    ipWhitelist: string[];
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    emailSignature: string;
  };
  integrations: {
    payrollProvider: string;
    attendanceSystem: string;
    sso: {
      enabled: boolean;
      provider: string;
      clientId: string;
      clientSecret: string;
    };
  };
  maintenance: {
    backupFrequency: string;
    retentionPeriod: number;
    maintenanceMode: boolean;
    debugMode: boolean;
  };
}

const defaultConfig: SystemConfig = {
  general: {
    companyName: "Aura HRMS",
    companyLogo: "",
    timezone: "UTC",
    dateFormat: "DD/MM/YYYY",
    currency: "USD",
    language: "en",
  },
  security: {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryDays: 90,
    },
    sessionTimeout: 30,
    twoFactorAuth: false,
    ipWhitelist: [],
  },
  email: {
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "Aura HRMS",
    emailSignature: "",
  },
  integrations: {
    payrollProvider: "",
    attendanceSystem: "",
    sso: {
      enabled: false,
      provider: "",
      clientId: "",
      clientSecret: "",
    },
  },
  maintenance: {
    backupFrequency: "daily",
    retentionPeriod: 30,
    maintenanceMode: false,
    debugMode: false,
  },
};

export function SystemSettings() {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(false);

  const updateGeneralSetting = (key: keyof SystemConfig['general'], value: any) => {
    setConfig(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [key]: value
      }
    }));
  };

  const updateSecuritySetting = (key: string, value: any) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setConfig(prev => ({
        ...prev,
        security: {
          ...prev.security,
          [parent]: {
            ...prev.security[parent as keyof SystemConfig['security']],
            [child]: value
          }
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        security: {
          ...prev.security,
          [key]: value
        }
      }));
    }
  };

  const updateEmailSetting = (key: keyof SystemConfig['email'], value: any) => {
    setConfig(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [key]: value
      }
    }));
  };

  const saveSettings = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("System settings saved successfully!");
    }, 1000);
  };

  const testEmailConnection = () => {
    toast.info("Testing email connection...");
    setTimeout(() => {
      toast.success("Email connection test successful!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground">
          Configure system-wide settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic system configuration and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={config.general.companyName}
                    onChange={(e) => updateGeneralSetting('companyName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={config.general.timezone} onValueChange={(value) => updateGeneralSetting('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select value={config.general.dateFormat} onValueChange={(value) => updateGeneralSetting('dateFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={config.general.currency} onValueChange={(value) => updateGeneralSetting('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={config.general.language} onValueChange={(value) => updateGeneralSetting('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-logo">Company Logo</Label>
                <div className="flex items-center gap-4">
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Recommended size: 200x80px, PNG or JPG
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security policies and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Password Policy</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-length">Minimum Length</Label>
                    <Input
                      id="min-length"
                      type="number"
                      value={config.security.passwordPolicy.minLength}
                      onChange={(e) => updateSecuritySetting('passwordPolicy.minLength', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry-days">Password Expiry (days)</Label>
                    <Input
                      id="expiry-days"
                      type="number"
                      value={config.security.passwordPolicy.expiryDays}
                      onChange={(e) => updateSecuritySetting('passwordPolicy.expiryDays', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-uppercase">Require uppercase letters</Label>
                    <Switch
                      id="require-uppercase"
                      checked={config.security.passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) => updateSecuritySetting('passwordPolicy.requireUppercase', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-numbers">Require numbers</Label>
                    <Switch
                      id="require-numbers"
                      checked={config.security.passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) => updateSecuritySetting('passwordPolicy.requireNumbers', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-special">Require special characters</Label>
                    <Switch
                      id="require-special"
                      checked={config.security.passwordPolicy.requireSpecialChars}
                      onCheckedChange={(checked) => updateSecuritySetting('passwordPolicy.requireSpecialChars', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Session & Access</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={config.security.sessionTimeout}
                      onChange={(e) => updateSecuritySetting('sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="two-factor"
                      checked={config.security.twoFactorAuth}
                      onCheckedChange={(checked) => updateSecuritySetting('twoFactorAuth', checked)}
                    />
                    <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>
                Configure SMTP settings for sending emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input
                    id="smtp-host"
                    value={config.email.smtpHost}
                    onChange={(e) => updateEmailSetting('smtpHost', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    value={config.email.smtpPort}
                    onChange={(e) => updateEmailSetting('smtpPort', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">SMTP Username</Label>
                  <Input
                    id="smtp-user"
                    value={config.email.smtpUser}
                    onChange={(e) => updateEmailSetting('smtpUser', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">SMTP Password</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={config.email.smtpPassword}
                    onChange={(e) => updateEmailSetting('smtpPassword', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input
                    id="from-email"
                    type="email"
                    value={config.email.fromEmail}
                    onChange={(e) => updateEmailSetting('fromEmail', e.target.value)}
                    placeholder="noreply@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-name">From Name</Label>
                  <Input
                    id="from-name"
                    value={config.email.fromName}
                    onChange={(e) => updateEmailSetting('fromName', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-signature">Email Signature</Label>
                <Textarea
                  id="email-signature"
                  value={config.email.emailSignature}
                  onChange={(e) => updateEmailSetting('emailSignature', e.target.value)}
                  placeholder="Best regards,&#10;The HR Team"
                />
              </div>

              <Button variant="outline" onClick={testEmailConnection}>
                Test Email Connection
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>
                Configure integrations with external systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Single Sign-On (SSO)</h4>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sso-enabled"
                    checked={config.integrations.sso.enabled}
                    onCheckedChange={(checked) => setConfig(prev => ({
                      ...prev,
                      integrations: {
                        ...prev.integrations,
                        sso: { ...prev.integrations.sso, enabled: checked }
                      }
                    }))}
                  />
                  <Label htmlFor="sso-enabled">Enable SSO</Label>
                </div>

                {config.integrations.sso.enabled && (
                  <div className="space-y-4 pl-6">
                    <div className="space-y-2">
                      <Label htmlFor="sso-provider">SSO Provider</Label>
                      <Select 
                        value={config.integrations.sso.provider} 
                        onValueChange={(value) => setConfig(prev => ({
                          ...prev,
                          integrations: {
                            ...prev.integrations,
                            sso: { ...prev.integrations.sso, provider: value }
                          }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select SSO provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google">Google</SelectItem>
                          <SelectItem value="microsoft">Microsoft Azure AD</SelectItem>
                          <SelectItem value="okta">Okta</SelectItem>
                          <SelectItem value="saml">SAML 2.0</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="client-id">Client ID</Label>
                        <Input
                          id="client-id"
                          value={config.integrations.sso.clientId}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            integrations: {
                              ...prev.integrations,
                              sso: { ...prev.integrations.sso, clientId: e.target.value }
                            }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client-secret">Client Secret</Label>
                        <Input
                          id="client-secret"
                          type="password"
                          value={config.integrations.sso.clientSecret}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            integrations: {
                              ...prev.integrations,
                              sso: { ...prev.integrations.sso, clientSecret: e.target.value }
                            }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">External Systems</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payroll-provider">Payroll Provider</Label>
                    <Select value={config.integrations.payrollProvider} onValueChange={(value) => setConfig(prev => ({
                      ...prev,
                      integrations: { ...prev.integrations, payrollProvider: value }
                    }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adp">ADP</SelectItem>
                        <SelectItem value="paychex">Paychex</SelectItem>
                        <SelectItem value="quickbooks">QuickBooks</SelectItem>
                        <SelectItem value="custom">Custom API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attendance-system">Attendance System</Label>
                    <Select value={config.integrations.attendanceSystem} onValueChange={(value) => setConfig(prev => ({
                      ...prev,
                      integrations: { ...prev.integrations, attendanceSystem: value }
                    }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select system" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="biometric">Biometric Scanner</SelectItem>
                        <SelectItem value="rfid">RFID Card</SelectItem>
                        <SelectItem value="mobile">Mobile App</SelectItem>
                        <SelectItem value="web">Web Check-in</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Maintenance & Backup
              </CardTitle>
              <CardDescription>
                System maintenance and data backup settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Backup Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <Select value={config.maintenance.backupFrequency} onValueChange={(value) => setConfig(prev => ({
                      ...prev,
                      maintenance: { ...prev.maintenance, backupFrequency: value }
                    }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retention-period">Retention Period (days)</Label>
                    <Input
                      id="retention-period"
                      type="number"
                      value={config.maintenance.retentionPeriod}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        maintenance: { ...prev.maintenance, retentionPeriod: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">System Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Temporarily disable user access for maintenance
                      </p>
                    </div>
                    <Switch
                      id="maintenance-mode"
                      checked={config.maintenance.maintenanceMode}
                      onCheckedChange={(checked) => setConfig(prev => ({
                        ...prev,
                        maintenance: { ...prev.maintenance, maintenanceMode: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="debug-mode">Debug Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable detailed logging for troubleshooting
                      </p>
                    </div>
                    <Switch
                      id="debug-mode"
                      checked={config.maintenance.debugMode}
                      onCheckedChange={(checked) => setConfig(prev => ({
                        ...prev,
                        maintenance: { ...prev.maintenance, debugMode: checked }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Quick Actions</h4>
                <div className="flex gap-2">
                  <Button variant="outline">Create Backup Now</Button>
                  <Button variant="outline">Clear Cache</Button>
                  <Button variant="outline">Reset Logs</Button>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
}

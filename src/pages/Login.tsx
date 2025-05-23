
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, UserRole } from '@/context/AuthContext';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (values: LoginFormValues, role?: UserRole) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password, role);
      
      // Success toast
      toast.success('Login successful', {
        description: 'Welcome back!',
      });
      
      // Navigate based on the role or return URL
      const from = location.state?.from?.pathname || getRoleDefaultPath(role);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Login failed', {
        description: 'Invalid email or password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDefaultPath = (role?: UserRole): string => {
    switch (role) {
      case 'system_admin':
        return '/system-admin';
      case 'tenant_admin':
        return '/tenant-admin';
      case 'employee':
        return '/ess';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-accent">Aura</span> HRMS
          </h1>
          <p className="text-muted-foreground">Sign in to access your dashboard</p>
        </div>
        
        <Tabs defaultValue="employee" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="employee">Employee</TabsTrigger>
            <TabsTrigger value="tenant-admin">HR Admin</TabsTrigger>
            <TabsTrigger value="system-admin">System Admin</TabsTrigger>
          </TabsList>
          
          {/* Employee Login Tab */}
          <TabsContent value="employee">
            <LoginCard 
              title="Employee Portal"
              description="Access your personal dashboard, leave requests, and more"
              form={form}
              onSubmit={(values) => handleLogin(values, 'employee')}
              isLoading={isLoading}
              defaultEmail="john@company.com"
            />
          </TabsContent>
          
          {/* Tenant Admin Login Tab */}
          <TabsContent value="tenant-admin">
            <LoginCard 
              title="HR Admin Portal"
              description="Manage your organization's HR processes and employees"
              form={form}
              onSubmit={(values) => handleLogin(values, 'tenant_admin')}
              isLoading={isLoading}
              defaultEmail="hradmin@company.com"
            />
          </TabsContent>
          
          {/* System Admin Login Tab */}
          <TabsContent value="system-admin">
            <LoginCard 
              title="System Admin Portal"
              description="Manage tenants, system settings, and global configurations"
              form={form}
              onSubmit={(values) => handleLogin(values, 'system_admin')}
              isLoading={isLoading}
              defaultEmail="admin@aurahrms.com"
            />
          </TabsContent>
        </Tabs>
        
        <p className="text-center mt-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Aura HRMS. All rights reserved.
        </p>
      </div>
    </div>
  );
};

interface LoginCardProps {
  title: string;
  description: string;
  form: any;
  onSubmit: (values: LoginFormValues) => void;
  isLoading: boolean;
  defaultEmail: string;
}

const LoginCard = ({ 
  title, 
  description, 
  form, 
  onSubmit, 
  isLoading, 
  defaultEmail 
}: LoginCardProps) => {
  
  const handleDemoLogin = () => {
    form.setValue('email', defaultEmail);
    form.setValue('password', 'password123');
    form.handleSubmit(onSubmit)();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleDemoLogin} 
          disabled={isLoading}
        >
          Demo Login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;

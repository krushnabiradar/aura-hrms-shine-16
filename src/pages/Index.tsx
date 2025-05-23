
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Building, Users, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // If user is already logged in, redirect to their dashboard
  if (isAuthenticated && user) {
    switch (user.role) {
      case "system_admin":
        navigate("/system-admin");
        break;
      case "tenant_admin":
        navigate("/tenant-admin");
        break;
      case "employee":
        navigate("/ess");
        break;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
        <div className="container max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="mb-10">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              <span className="text-accent">Aura</span> HRMS
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive Human Resource Management System for modern organizations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* System Admin Card */}
            <div className="bg-card border rounded-xl p-6 flex flex-col items-center">
              <div className="bg-accent/10 p-4 rounded-full mb-4">
                <Building className="h-10 w-10 text-accent" />
              </div>
              <h2 className="text-xl font-bold mb-2">System Admin</h2>
              <p className="text-muted-foreground mb-6 flex-grow">
                Manage tenants and global system configurations
              </p>
              <Button 
                className="w-full"
                onClick={() => navigate("/login", { state: { role: "system_admin" } })}
              >
                Access Admin
              </Button>
            </div>

            {/* Tenant Admin Card */}
            <div className="bg-card border rounded-xl p-6 flex flex-col items-center">
              <div className="bg-accent/10 p-4 rounded-full mb-4">
                <Users className="h-10 w-10 text-accent" />
              </div>
              <h2 className="text-xl font-bold mb-2">HR Admin</h2>
              <p className="text-muted-foreground mb-6 flex-grow">
                Manage your organization's HR processes and employees
              </p>
              <Button 
                className="w-full"
                onClick={() => navigate("/login", { state: { role: "tenant_admin" } })}
              >
                Access HR Portal
              </Button>
            </div>

            {/* Employee Card */}
            <div className="bg-card border rounded-xl p-6 flex flex-col items-center">
              <div className="bg-accent/10 p-4 rounded-full mb-4">
                <User className="h-10 w-10 text-accent" />
              </div>
              <h2 className="text-xl font-bold mb-2">Employee</h2>
              <p className="text-muted-foreground mb-6 flex-grow">
                Access your personal dashboard, leave requests, and more
              </p>
              <Button 
                className="w-full"
                onClick={() => navigate("/login", { state: { role: "employee" } })}
              >
                Access ESS
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-16">
            © {new Date().getFullYear()} Aura HRMS. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;

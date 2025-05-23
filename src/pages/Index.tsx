
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Building, Users, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // If user is already logged in, redirect to their dashboard
  useEffect(() => {
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
    } else {
      // If not authenticated, redirect to landing page
      navigate("/landing");
    }
  }, [isAuthenticated, user, navigate]);

  // Show a minimal loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;

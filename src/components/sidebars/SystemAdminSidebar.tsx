
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building,
  Settings,
  Users,
  CreditCard,
  Shield,
  BarChart3,
  AlertTriangle,
  HelpCircle
} from "lucide-react";

export function SystemAdminSidebar() {
  const { pathname } = useLocation();

  const links = [
    { href: "/system-admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/system-admin/tenants", icon: Building, label: "Tenants" },
    { href: "/system-admin/users", icon: Users, label: "Users" },
    { href: "/system-admin/billing", icon: CreditCard, label: "Billing" },
    { href: "/system-admin/security", icon: Shield, label: "Security" },
    { href: "/system-admin/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/system-admin/logs", icon: AlertTriangle, label: "Logs" },
    { href: "/system-admin/settings", icon: Settings, label: "Settings" },
    { href: "/system-admin/help", icon: HelpCircle, label: "Help & Support" }
  ];

  return (
    <div className="flex flex-col min-h-full py-4">
      <div className="px-4 mb-8">
        <Link to="/system-admin" className="flex items-center gap-2">
          <span className="text-xl font-bold text-accent">Aura</span>
          <span className="text-xl font-bold">HRMS</span>
        </Link>
        <div className="mt-2 text-sm text-muted-foreground">System Administration</div>
      </div>
      
      <div className="flex-1">
        <nav className="flex flex-col gap-1 px-2">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === link.href ? "bg-accent/10 text-accent font-medium" : "text-muted-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="px-4 mt-auto pt-6 border-t text-sm text-muted-foreground">
        <p>Aura HRMS v1.0</p>
        <p>System Admin Panel</p>
      </div>
    </div>
  );
}


import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Clock,
  Calendar,
  FileText,
  CreditCard,
  Award,
  Settings,
  MessageSquare,
  HelpCircle
} from "lucide-react";

export function EmployeeSidebar() {
  const { pathname } = useLocation();

  const links = [
    { href: "/ess", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/ess/profile", icon: User, label: "My Profile" },
    { href: "/ess/attendance", icon: Clock, label: "Attendance" },
    { href: "/ess/leave", icon: Calendar, label: "Leave" },
    { href: "/ess/documents", icon: FileText, label: "Documents" },
    { href: "/ess/payslips", icon: CreditCard, label: "Payslips" },
    { href: "/ess/performance", icon: Award, label: "Performance" },
    { href: "/ess/help", icon: MessageSquare, label: "Help Desk" },
    { href: "/ess/settings", icon: Settings, label: "Settings" }
  ];

  return (
    <div className="flex flex-col min-h-full py-4">
      <div className="px-4 mb-8">
        <Link to="/ess" className="flex items-center gap-2">
          <span className="text-xl font-bold text-accent">Aura</span>
          <span className="text-xl font-bold">HRMS</span>
        </Link>
        <div className="mt-2 text-sm text-muted-foreground">Employee Self-Service</div>
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
        <p className="mb-2">Need help?</p>
        <Link
          to="/ess/help"
          className="flex items-center gap-2 text-xs text-accent hover:underline"
        >
          <HelpCircle className="h-3 w-3" />
          Contact Support
        </Link>
      </div>
    </div>
  );
}

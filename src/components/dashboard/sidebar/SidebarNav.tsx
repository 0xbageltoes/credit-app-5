import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  User,
  LineChart
} from "lucide-react";

export function SidebarNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname === `/dashboard${path}`;
  };

  return (
    <nav className="flex flex-col gap-2">
      <Link
        to="/dashboard"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary",
          isActive("/") && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        <LayoutDashboard className="h-4 w-4" />
        <span>Overview</span>
      </Link>
      <Link
        to="/dashboard/analyze"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary",
          isActive("/analyze") && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        <LineChart className="h-4 w-4" />
        <span>Analyze</span>
      </Link>
      <Link
        to="/dashboard/profile"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary",
          isActive("/profile") && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        <User className="h-4 w-4" />
        <span>Profile</span>
      </Link>
      <Link
        to="/dashboard/settings"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary",
          isActive("/settings") && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </Link>
    </nav>
  );
}
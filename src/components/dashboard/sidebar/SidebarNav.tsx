import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Settings, User } from "lucide-react";

export function SidebarNav({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <nav className="flex flex-col gap-1 p-2">
      <NavLink
        to="/dashboard"
        end
        className={({ isActive }) =>
          cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
          )
        }
      >
        <LayoutDashboard className="h-4 w-4" />
        {!isCollapsed && <span>Overview</span>}
      </NavLink>
      <NavLink
        to="/dashboard/profile"
        className={({ isActive }) =>
          cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
          )
        }
      >
        <User className="h-4 w-4" />
        {!isCollapsed && <span>Profile</span>}
      </NavLink>
      <NavLink
        to="/dashboard/settings"
        className={({ isActive }) =>
          cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
          )
        }
      >
        <Settings className="h-4 w-4" />
        {!isCollapsed && <span>Settings</span>}
      </NavLink>
    </nav>
  );
}
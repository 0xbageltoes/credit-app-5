import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-sidebar text-sidebar-foreground",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center border-b px-2">
        <span className={cn("mx-2 text-lg font-semibold", isCollapsed && "hidden")}>
          Dashboard
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")}
          />
        </Button>
      </div>
      <ScrollArea className="flex-1">
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
      </ScrollArea>
    </div>
  );
}
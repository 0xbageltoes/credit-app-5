import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Settings,
  User,
  LineChart,
} from "lucide-react";

interface SidebarNavProps {
  isCollapsed: boolean;
}

export function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const links = [
    {
      title: "Overview",
      label: "",
      icon: BarChart3,
      variant: "default",
      to: "/dashboard",
    },
    {
      title: "Analyze",
      label: "",
      icon: LineChart,
      variant: "ghost",
      to: "/dashboard/analyze",
    },
    {
      title: "Profile",
      label: "",
      icon: User,
      variant: "ghost",
      to: "/dashboard/profile",
    },
    {
      title: "Settings",
      label: "",
      icon: Settings,
      variant: "ghost",
      to: "/dashboard/settings",
    },
  ];

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent" : "transparent",
                isCollapsed && "justify-center"
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {!isCollapsed && <span>{link.title}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
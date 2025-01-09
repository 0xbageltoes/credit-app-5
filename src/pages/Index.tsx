import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Routes, Route } from "react-router-dom";
import Overview from "./dashboard/Overview";
import Profile from "./dashboard/Profile";
import Settings from "./dashboard/Settings";

export default function Index() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import Overview from "./dashboard/Overview";
import Profile from "./dashboard/Profile";
import Settings from "./dashboard/Settings";
import Analyze from "./dashboard/Analyze";

const Index = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="analyze" element={<Analyze />} />
      </Route>
    </Routes>
  );
};

export default Index;
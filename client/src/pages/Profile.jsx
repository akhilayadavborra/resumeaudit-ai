import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import ProfileCard from "../components/profile/ProfileCard";
import ChangePassword from "../components/profile/ChangePassword";
import AccountSettings from "../components/profile/AccountSettings";

export default function Profile() {
  return (
    <DashboardLayout>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <div className="px-6 md:px-8 py-8 max-w-2xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
              <p className="text-gray-400 mt-1">Manage your account information and security.</p>
            </div>
            <ProfileCard />
            <ChangePassword />
            <AccountSettings />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
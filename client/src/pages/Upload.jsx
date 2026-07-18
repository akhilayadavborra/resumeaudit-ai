import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import UploadResume from "../components/upload/UploadResume";

export default function Upload() {
  return (
    <DashboardLayout>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <UploadResume />
        </div>
      </div>
    </DashboardLayout>
  );
}
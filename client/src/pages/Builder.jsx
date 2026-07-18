import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import ResumeBuilderWizard from "../components/builder/ResumeBuilderWizard";

export default function Builder() {
  return (
    <DashboardLayout>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <ResumeBuilderWizard />
        </div>
      </div>
    </DashboardLayout>
  );
}
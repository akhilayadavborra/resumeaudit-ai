import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileUp } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import DashboardCards from "../components/dashboard/DashboardCards";
import ScoreChart from "../components/dashboard/ScoreChart";
import RecentAnalyses from "../components/dashboard/RecentAnalyses";
import Loader from "../components/common/Loader";
import { PrimaryButton } from "../components/ui/GlowButton";
import { useAuth } from "../context/AuthContext";
import api, { getErrorMessage } from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          api.get("/api/analytics/dashboard"),
          api.get("/api/resume/history?limit=5"),
        ]);
        setStats(statsRes.data);
        setHistory(historyRes.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex"><Sidebar /><div className="flex-1"><Topbar />
          <div className="min-h-[60vh] flex items-center justify-center"><Loader label="Loading dashboard..." /></div>
        </div></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <div className="px-6 md:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">Welcome back, {user?.full_name?.split(" ")[0] || "there"} 👋</h1>
                <p className="text-gray-400 mt-1">Here's how your resumes are performing.</p>
              </div>
              <Link to="/upload"><PrimaryButton><FileUp className="w-4 h-4" /> Analyze New Resume</PrimaryButton></Link>
            </div>

            {stats.total_analyses === 0 ? (
              <div className="glass-card p-14 text-center">
                <FileUp className="w-12 h-12 text-accent-orange mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white">No analyses yet</h3>
                <p className="text-gray-400 mt-2">Upload your first resume to get started.</p>
                <Link to="/upload"><PrimaryButton className="mt-6">Analyze My Resume</PrimaryButton></Link>
              </div>
            ) : (
              <div className="space-y-6">
                <DashboardCards stats={stats} />
                <ScoreChart data={stats.score_trend} />
                <RecentAnalyses analyses={history} />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
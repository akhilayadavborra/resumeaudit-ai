import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Trash2, ArrowRight, FileUp, GitCompare } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import GlowCard from "../components/ui/GlowCard";
import { PrimaryButton, SecondaryButton } from "../components/ui/GlowButton";
import Loader from "../components/common/Loader";
import api, { getErrorMessage } from "../services/api";

function scoreColor(score) {
  if (score >= 80) return "text-accent-amber";
  if (score >= 60) return "text-accent-orange-light";
  if (score >= 40) return "text-yellow-500";
  return "text-red-400";
}

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [selected, setSelected] = useState([]); // holds up to 2 selected analysis IDs
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const { data } = await api.get("/api/resume/history");
      setAnalyses(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    setDeletingId(id);
    try {
      await api.delete(`/api/resume/${id}`);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      setSelected((prev) => prev.filter((sid) => sid !== id));
      toast.success("Analysis deleted");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  const toggleSelect = (e, id) => {
    e.preventDefault();
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((sid) => sid !== id);
      if (prev.length >= 2) return [prev[1], id]; // keep only the last 2 selected
      return [...prev, id];
    });
  };

  const handleCompare = () => {
    if (selected.length !== 2) return;
    // Order chronologically: older analysis first (from), newer second (to)
    const a = analyses.find((x) => x.id === selected[0]);
    const b = analyses.find((x) => x.id === selected[1]);
    const [fromId, toId] = new Date(a.created_at) < new Date(b.created_at)
      ? [a.id, b.id] : [b.id, a.id];
    navigate(`/compare/${fromId}/${toId}`);
  };

  return (
    <DashboardLayout>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <div className="px-6 md:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Analysis History</h1>
                <p className="text-gray-400 mt-1">All your past resume analyses.</p>
              </div>
              <Link to="/upload"><PrimaryButton><FileUp className="w-4 h-4" /> New Analysis</PrimaryButton></Link>
            </div>

            {analyses.length >= 2 && (
              <div className="glass-card p-4 mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Select two analyses below to compare improvement{" "}
                  <span className="text-gray-600">({selected.length}/2 selected)</span>
                </p>
                <SecondaryButton onClick={handleCompare} disabled={selected.length !== 2}>
                  <GitCompare className="w-4 h-4" /> Compare Selected
                </SecondaryButton>
              </div>
            )}

            {loading ? (
              <div className="min-h-[40vh] flex items-center justify-center"><Loader label="Loading history..." /></div>
            ) : analyses.length === 0 ? (
              <GlowCard className="p-14 text-center">
                <FileText className="w-12 h-12 text-accent-orange mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white">No analyses yet</h3>
              </GlowCard>
            ) : (
              <div className="grid gap-3">
                {analyses.map((a) => (
                  <Link key={a.id} to={`/analysis/${a.id}`}>
                    <GlowCard hover className={`p-5 flex items-center justify-between group ${selected.includes(a.id) ? "border-accent-orange/50 bg-accent-orange/[0.03]" : ""}`}>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => toggleSelect(e, a.id)}
                          className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center transition-colors ${
                            selected.includes(a.id) ? "bg-accent-orange border-accent-orange" : "border-white/20 hover:border-accent-orange/50"
                          }`}
                        >
                          {selected.includes(a.id) && <span className="w-2 h-2 rounded-sm bg-white" />}
                        </button>
                        <div className="w-11 h-11 rounded-xl bg-white/[0.04] flex items-center justify-center">
                          <FileText className="w-5 h-5 text-accent-orange-light" />
                        </div>
                        <div>
                          <p className="text-gray-200 font-medium">{a.filename}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(a.created_at).toLocaleString()}
                            {a.job_description_provided && <span className="ml-2 text-accent-orange-light">• JD matched</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-bold text-lg ${scoreColor(a.ats_score)}`}>{Math.round(a.ats_score)}</span>
                        <button onClick={(e) => handleDelete(e, a.id)} disabled={deletingId === a.id}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-accent-orange-light" />
                      </div>
                    </GlowCard>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
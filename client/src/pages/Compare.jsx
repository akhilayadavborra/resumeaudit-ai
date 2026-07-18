import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import GlowCard from "../components/ui/GlowCard";
import Loader from "../components/common/Loader";
import api, { getErrorMessage } from "../services/api";

function scoreColor(score) {
  if (score >= 80) return "text-accent-amber";
  if (score >= 60) return "text-accent-orange-light";
  if (score >= 40) return "text-yellow-500";
  return "text-red-400";
}

export default function Compare() {
  const { fromId, toId } = useParams();
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const { data } = await api.get(`/api/resume/compare/${fromId}/${toId}`);
        setComparison(data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, [fromId, toId]);

  const Wrapper = ({ children }) => (
    <DashboardLayout><div className="flex"><Sidebar /><div className="flex-1"><Topbar />{children}</div></div></DashboardLayout>
  );

  if (loading) return <Wrapper><div className="min-h-[60vh] flex items-center justify-center"><Loader label="Comparing analyses..." /></div></Wrapper>;
  if (!comparison) return <Wrapper><div className="min-h-[60vh] flex items-center justify-center text-gray-400">Comparison not found.</div></Wrapper>;

  const { from_analysis, to_analysis, score_delta, skills_gained, skills_lost, issues_resolved, issues_persisting, new_issues } = comparison;
  const improved = score_delta > 0;

  return (
    <Wrapper>
      <div className="px-6 md:px-8 py-8 max-w-4xl space-y-6">
        <Link to="/history" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200">
          <ArrowLeft className="w-4 h-4" /> Back to History
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-white">Resume Comparison</h1>
          <p className="text-gray-400 mt-1">Tracking your improvement between two versions.</p>
        </div>

        {/* Score comparison hero */}
        <GlowCard className="p-8">
          <div className="flex items-center justify-between gap-6">
            <div className="text-center flex-1">
              <p className="text-xs text-gray-500 mb-1">{new Date(from_analysis.created_at).toLocaleDateString()}</p>
              <p className="text-sm text-gray-400 mb-2 truncate">{from_analysis.filename}</p>
              <p className={`text-4xl font-bold ${scoreColor(from_analysis.ats_score)}`}>{Math.round(from_analysis.ats_score)}</p>
            </div>

            <div className="flex flex-col items-center gap-2 px-4">
              {improved ? <TrendingUp className="w-8 h-8 text-accent-amber" /> : <TrendingDown className="w-8 h-8 text-red-400" />}
              <span className={`font-bold text-lg ${improved ? "text-accent-amber" : "text-red-400"}`}>
                {improved ? "+" : ""}{score_delta}
              </span>
            </div>

            <div className="text-center flex-1">
              <p className="text-xs text-gray-500 mb-1">{new Date(to_analysis.created_at).toLocaleDateString()}</p>
              <p className="text-sm text-gray-400 mb-2 truncate">{to_analysis.filename}</p>
              <p className={`text-4xl font-bold ${scoreColor(to_analysis.ats_score)}`}>{Math.round(to_analysis.ats_score)}</p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            {improved
              ? `Great progress! Your score improved by ${score_delta} points.`
              : score_delta < 0
              ? `Your score dropped by ${Math.abs(score_delta)} points — check what changed below.`
              : "Your score stayed the same between these two versions."}
          </p>
        </GlowCard>

        {/* Skills gained/lost */}
        <div className="grid sm:grid-cols-2 gap-6">
          <GlowCard className="p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-amber" /> Skills Gained ({skills_gained.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills_gained.length > 0 ? skills_gained.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-accent-amber/10 border border-accent-amber/30 text-accent-amber">{s}</span>
              )) : <p className="text-sm text-gray-600">No new skills detected.</p>}
            </div>
          </GlowCard>

          <GlowCard className="p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" /> Skills Lost ({skills_lost.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills_lost.length > 0 ? skills_lost.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300">{s}</span>
              )) : <p className="text-sm text-gray-600">Nothing lost — good.</p>}
            </div>
          </GlowCard>
        </div>

        {/* Issues resolved */}
        {issues_resolved.length > 0 && (
          <GlowCard className="p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-amber" /> Issues You Fixed
            </h3>
            <ul className="space-y-2">
              {issues_resolved.map((msg, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-amber mt-0.5 shrink-0" /> {msg}
                </li>
              ))}
            </ul>
          </GlowCard>
        )}

        {/* Issues still present */}
        {issues_persisting.length > 0 && (
          <GlowCard className="p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" /> Still Needs Attention
            </h3>
            <ul className="space-y-2">
              {issues_persisting.map((msg, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" /> {msg}
                </li>
              ))}
            </ul>
          </GlowCard>
        )}

        {/* New issues introduced */}
        {new_issues.length > 0 && (
          <GlowCard className="p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" /> New Issues Introduced
            </h3>
            <ul className="space-y-2">
              {new_issues.map((msg, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" /> {msg}
                </li>
              ))}
            </ul>
          </GlowCard>
        )}
      </div>
    </Wrapper>
  );
}
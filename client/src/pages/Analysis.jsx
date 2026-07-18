import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import Loader from "../components/common/Loader";
import ATSScore from "../components/analysis/ATSScore";
import SkillsAnalysis from "../components/analysis/SkillsAnalysis";
import WeakPoints from "../components/analysis/WeakPoints";
import Suggestions from "../components/analysis/Suggestions";
import JDComparison from "../components/analysis/JDComparison";
import ResumePreview from "../components/analysis/ResumePreview";
import GlowCard from "../components/ui/GlowCard";
import { SecondaryButton } from "../components/ui/GlowButton";
import api, { getErrorMessage } from "../services/api";
import LineSuggestions from "../components/analysis/LineSuggestions";
import RoleMatch from "../components/analysis/RoleMatch";
const BREAKDOWN_MAX = { section_completeness: 20, keyword_skill_match: 30, formatting_grammar: 20, semantic_relevance: 20, contact_structure: 10 };

export default function Analysis() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { data } = await api.get(`/api/resume/${id}`);
        setAnalysis(data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await api.get(`/api/resume/${id}/report`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ResumeAudit_Report_${analysis.filename}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDownloading(false);
    }
  };

  const Wrapper = ({ children }) => (
    <DashboardLayout><div className="flex"><Sidebar /><div className="flex-1"><Topbar />{children}</div></div></DashboardLayout>
  );

  if (loading) return <Wrapper><div className="min-h-[60vh] flex items-center justify-center"><Loader label="Loading analysis..." /></div></Wrapper>;
  if (!analysis) return <Wrapper><div className="min-h-[60vh] flex items-center justify-center text-gray-400">Analysis not found.</div></Wrapper>;

  return (
    <Wrapper>
      <div className="px-6 md:px-8 py-8 max-w-5xl space-y-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">{analysis.filename}</h1>
          <SecondaryButton onClick={handleDownload}>
            <Download className="w-4 h-4" /> {downloading ? "Preparing..." : "Download PDF Report"}
          </SecondaryButton>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <GlowCard className="p-8 flex flex-col items-center justify-center"><ATSScore score={analysis.ats_score} /></GlowCard>
          <GlowCard className="p-6 lg:col-span-2">
            <h3 className="font-semibold text-white mb-5">Score Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(analysis.score_breakdown).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-300 capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="text-gray-400">{value} / {BREAKDOWN_MAX[key]}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-accent-orange to-accent-amber" style={{ width: `${(value / BREAKDOWN_MAX[key]) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>

        <ResumePreview contactInfo={analysis.contact_info} sectionsDetected={analysis.sections_detected} yearsExperience={analysis.estimated_years_experience} />
        <SkillsAnalysis skills={analysis.skills_detected} />
        <JDComparison jobMatch={analysis.job_match} />
        <RoleMatch roleMatch={analysis.role_match} />
        <WeakPoints issues={analysis.formatting_issues} />
        <LineSuggestions suggestions={analysis.line_level_suggestions} />
        <Suggestions suggestions={analysis.suggestions} />
      </div>
    </Wrapper>
  );
}
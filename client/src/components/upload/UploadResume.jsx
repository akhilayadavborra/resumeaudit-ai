import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ScanSearch } from "lucide-react";
import DragDrop from "./DragDrop";
import UploadProgress from "./UploadProgress";
import GlowCard from "../ui/GlowCard";
import { PrimaryButton } from "../ui/GlowButton";
import api, { getErrorMessage } from "../../services/api";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();
  const [targetRole, setTargetRole] = useState("");

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload a resume file first.");
      return;
    }
    setAnalyzing(true);

    const formData = new FormData();
    formData.append("file", file);
    if (jobDescription.trim()) formData.append("job_description", jobDescription.trim());
    if (targetRole) formData.append("target_role", targetRole);

    try {
      const { data } = await api.post("/api/resume/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Analysis complete!");
      navigate(`/analysis/${data.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setAnalyzing(false);
    }
  };

  if (analyzing) return <UploadProgress label="Parsing resume & running NLP analysis..." />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-white">Analyze Your Resume</h1>
      <p className="text-gray-400 mt-1">Upload a PDF or DOCX file to get your ATS score instantly.</p>

      <GlowCard className="p-6 mt-8">
        <DragDrop file={file} setFile={setFile} />
    <div className="mt-6">
          <label className="text-sm text-gray-300 mb-2 block">
            Target Role <span className="text-gray-500">(optional, scores against role-specific expectations)</span>
          </label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="input-field cursor-pointer"
            style={{ colorScheme: "dark" }}
          >
            <option value="" style={{ background: "#1d1c20", color: "#e5e7eb" }}>No specific role</option>
            <option value="software_engineer" style={{ background: "#1d1c20", color: "#e5e7eb" }}>Software Engineer</option>
            <option value="data_analyst" style={{ background: "#1d1c20", color: "#e5e7eb" }}>Data Analyst</option>
            <option value="ai_engineer" style={{ background: "#1d1c20", color: "#e5e7eb" }}>AI / ML Engineer</option>
            <option value="frontend_developer" style={{ background: "#1d1c20", color: "#e5e7eb" }}>Frontend Developer</option>
            <option value="backend_developer" style={{ background: "#1d1c20", color: "#e5e7eb" }}>Backend Developer</option>
            <option value="product_manager" style={{ background: "#1d1c20", color: "#e5e7eb" }}>Product Manager</option>
            <option value="devops_engineer" style={{ background: "#1d1c20", color: "#e5e7eb" }}>DevOps Engineer</option>
          </select>
        </div>
        <div className="mt-6">
          <label className="text-sm text-gray-300 mb-2 block">
            Job Description <span className="text-gray-500">(optional, for keyword & skill matching)</span>
          </label>
          <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={6}
            className="input-field resize-none"
            placeholder="Paste the job description here to see how well your resume matches..." />
        </div>
        <PrimaryButton onClick={handleAnalyze} disabled={!file} className="w-full mt-6">
          <ScanSearch className="w-4 h-4" /> Run ATS Analysis
        </PrimaryButton>
      </GlowCard>
    </div>
  );
}
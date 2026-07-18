import React, { useState } from "react";
import toast from "react-hot-toast";
import { Sparkles, FileText, ChevronDown, Wand2 } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import GlowCard from "../components/ui/GlowCard";
import { PrimaryButton } from "../components/ui/GlowButton";
import DragDrop from "../components/upload/DragDrop";
import api, { getErrorMessage } from "../services/api";

export default function TailorResume() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("with_jd"); // "with_jd" | "without_jd"
  const [jobDescription, setJobDescription] = useState("");
  const [processing, setProcessing] = useState(false);
  const [formatMenuOpen, setFormatMenuOpen] = useState(false);
  const [generating, setGenerating] = useState(null);
  const [aiContent, setAiContent] = useState(null);

  const handleAnalyzeAndTailor = async () => {
    if (!file) {
      toast.error("Please upload a resume first.");
      return;
    }
    if (mode === "with_jd" && jobDescription.trim().length < 20) {
      toast.error("Please paste a job description (at least a few sentences), or switch to 'Without Job Description'.");
      return;
    }

    setProcessing(true);
    setAiContent(null);
    const formData = new FormData();
    formData.append("file", file);
    if (mode === "with_jd") formData.append("job_description", jobDescription.trim());

    try {
      const { data } = await api.post("/api/builder/tailor", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAiContent(data);
      toast.success("Your tailored resume is ready to download!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async (format) => {
    setGenerating(format);
    try {
      const payload = {
        full_name: aiContent.full_name || "Resume",
        email: aiContent.email || "",
        phone: aiContent.phone || "",
        linkedin: aiContent.linkedin || "",
        summary: aiContent.summary || "",
        experience: aiContent.experience || [],
        education: aiContent.education || [],
        skills: aiContent.skills || [],
        projects: [],
        certifications: [],
      };
      const response = await api.post(`/api/builder/generate/${format}`, payload, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${(aiContent.full_name || "Resume").replace(/\s+/g, "_")}_Tailored.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Downloaded as .${format}!`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setGenerating(null);
      setFormatMenuOpen(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <div className="max-w-3xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold text-white">Tailor Your Resume</h1>
            <p className="text-gray-400 mt-1">Upload your existing resume — our AI will polish it into a clean, ATS-friendly version.</p>

            <GlowCard className="p-6 mt-8 space-y-6">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Upload Your Resume</label>
                <DragDrop file={file} setFile={setFile} />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="input-field cursor-pointer"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="with_jd" style={{ background: "#1d1c20", color: "#e5e7eb" }}>With Job Description (tailor to a specific role)</option>
                  <option value="without_jd" style={{ background: "#1d1c20", color: "#e5e7eb" }}>Without Job Description (general polish)</option>
                </select>
              </div>

              {mode === "with_jd" && (
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Job Description</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={8}
                    className="input-field resize-none"
                    placeholder="Paste the job description you're targeting..."
                  />
                </div>
              )}

              <PrimaryButton onClick={handleAnalyzeAndTailor} disabled={!file || processing} className="w-full">
                {processing ? "AI is rewriting your resume..." : (<><Wand2 className="w-4 h-4" /> Generate Tailored Resume</>)}
              </PrimaryButton>
            </GlowCard>

            {aiContent && (
              <GlowCard className="p-6 mt-6 text-center">
                <Sparkles className="w-10 h-10 text-accent-orange mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-1">Your resume is ready</h3>
                <p className="text-sm text-gray-400 mb-5">{aiContent.summary}</p>

                <div className="relative inline-block">
                  <PrimaryButton onClick={() => setFormatMenuOpen(!formatMenuOpen)} disabled={generating !== null} className="min-w-[220px]">
                    {generating ? `Generating ${generating.toUpperCase()}...` : (<>Download Resume <ChevronDown className="w-4 h-4" /></>)}
                  </PrimaryButton>

                  {formatMenuOpen && !generating && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-full glass-card overflow-hidden z-10">
                      <button onClick={() => handleDownload("pdf")}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-200 hover:bg-accent-orange/10 hover:text-accent-orange-light transition-colors">
                        <FileText className="w-4 h-4" /> Download as PDF
                      </button>
                      <button onClick={() => handleDownload("docx")}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-200 hover:bg-accent-orange/10 hover:text-accent-orange-light transition-colors border-t border-white/[0.06]">
                        <FileText className="w-4 h-4" /> Download as DOCX
                      </button>
                    </div>
                  )}
                </div>
              </GlowCard>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
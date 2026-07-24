import React, { useState } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Download, FileText, Mail, Phone, Linkedin, Github, Plus, X, Sparkles, ChevronDown } from "lucide-react";
import GlowCard from "../ui/GlowCard";
import Input from "../common/Input";
import { PrimaryButton, SecondaryButton } from "../ui/GlowButton";
import ExperienceStep from "./ExperienceStep";
import EducationStep from "./EducationStep";
import ProjectsStep from "./ProjectsStep";
import api, { getErrorMessage } from "../../services/api";

const STEPS = ["Contact", "Experience", "Education", "Skills", "Projects", "Certifications", "Additional Notes", "Generate"];
export default function ResumeBuilderWizard() {
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(null);

  const [notes, setNotes] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [experience, setExperience] = useState([{ company: "", title: "", start_date: "", end_date: "Present", bullets: [""] }]);
  const [education, setEducation] = useState([{ school: "", degree: "", start_date: "", end_date: "" }]);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certInput, setCertInput] = useState("");
  const [certifications, setCertifications] = useState([]);
  const [github, setGithub] = useState("");
  const [formatMenuOpen, setFormatMenuOpen] = useState(false);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };
  const addCert = () => {
    if (certInput.trim()) {
      setCertifications([...certifications, certInput.trim()]);
      setCertInput("");
    }
  };

  const buildRawPayload = () => ({
    full_name: fullName, email, phone, linkedin, summary: "",
    experience: experience.filter((e) => e.title || e.company).map((e) => ({ ...e, bullets: e.bullets.filter((b) => b.trim()) })),
    education: education.filter((e) => e.school || e.degree),
    skills,
    projects: projects.filter((p) => p.name).map((p) => ({ ...p, bullets: p.bullets.filter((b) => b.trim()) })),
    certifications,
  });

  const buildFinalPayload = (aiContent) => ({
    full_name: fullName,
    email,
    phone,
    linkedin,
    summary: aiContent?.summary || "",
    experience: aiContent?.experience?.length ? aiContent.experience : buildRawPayload().experience,
    education: education.filter((e) => e.school || e.degree),
    skills,
    projects: aiContent?.projects?.length ? aiContent.projects : buildRawPayload().projects,
    certifications,
    job_description: null,
  });

  const handleGenerate = async (format) => {
    if (!fullName || !email) {
      toast.error("Full name and email are required.");
      setStep(0);
      return;
    }
    setGenerating(format);
    try {
      // Step 1: send rough details + notes to Gemini for polished rewriting
      const { data: aiContent } = await api.post("/api/builder/ai-generate", {
        raw_data: buildRawPayload(),
        notes: notes.trim(),
      });

      // Step 2: generate the actual file using the AI-polished content
      const response = await api.post(`/api/builder/generate/${format}`, buildFinalPayload(aiContent), {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fullName.replace(/\s+/g, "_")}_Resume.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Resume downloaded as .${format}!`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setGenerating(null);
      setFormatMenuOpen(false);
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-white">Build Your Resume</h1>
      <p className="text-gray-400 mt-1">A clean, ATS-friendly resume, built section by section.</p>

      <div className="flex items-center gap-1 mt-6 mb-8 overflow-x-auto pb-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center shrink-0">
            <button
              onClick={() => setStep(i)}
              className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-colors ${
                i === step ? "bg-accent-orange text-white" : i < step ? "bg-accent-amber/30 text-accent-amber" : "bg-white/[0.06] text-gray-500"
              }`}
            >
              {i + 1}
            </button>
            {i < STEPS.length - 1 && <div className={`w-6 h-px ${i < step ? "bg-accent-amber/40" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>
      <p className="text-sm text-accent-orange-light font-medium mb-6">{STEPS[step]}</p>

      <GlowCard className="p-6">
        {step === 0 && (
          <div className="space-y-4">
            <Input placeholder="Full Name *" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input icon={Mail} type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input icon={Phone} placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input icon={Linkedin} placeholder="LinkedIn URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
            <Input icon={Github} placeholder="GitHub URL" value={github} onChange={(e) => setGithub(e.target.value)} />
          </div>
        )}

        {step === 1 && <ExperienceStep experience={experience} setExperience={setExperience} />}
        {step === 2 && <EducationStep education={education} setEducation={setEducation} />}

        {step === 3 && (
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Skills</label>
            <div className="flex gap-2 mb-3">
              <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                className="input-field flex-1" placeholder="Type a skill and press Enter" />
              <SecondaryButton type="button" onClick={addSkill}><Plus className="w-4 h-4" /></SecondaryButton>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-accent-orange/10 border border-accent-orange/30 text-accent-orange-light">
                  {s} <button onClick={() => setSkills(skills.filter((x) => x !== s))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
        )}

        {step === 4 && <ProjectsStep projects={projects} setProjects={setProjects} />}

        {step === 5 && (
        
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Certifications</label>
            <div className="flex gap-2 mb-3">
              <input value={certInput} onChange={(e) => setCertInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCert())}
                className="input-field flex-1" placeholder="e.g. AWS Certified Solutions Architect" />
              <SecondaryButton type="button" onClick={addCert}><Plus className="w-4 h-4" /></SecondaryButton>
            </div>
           <div className="space-y-2">
              {certifications.map((c) => (
                <div key={c} className="flex items-center justify-between text-sm text-gray-300 bg-white/[0.03] rounded-lg px-3 py-2">
                  {c} <button onClick={() => setCertifications(certifications.filter((x) => x !== c))}><X className="w-4 h-4 text-gray-500" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Anything else? <span className="text-gray-500">(job description you're targeting, tone preferences, or any other instructions before we generate)</span>
            </label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={8}
              className="input-field resize-none" placeholder="Optional — paste a job description, mention your target role, or any specific instructions..." />
          </div>
        )}

        {step === 7 && (
          <div className="text-center py-4">
            <Sparkles className="w-12 h-12 text-accent-orange mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-1">Ready to generate your resume</h3>
            <p className="text-sm text-gray-400 mb-6">
              Our AI will polish your details into a professional, ATS-friendly resume.
            </p>

            <div className="relative inline-block">
              <PrimaryButton
                onClick={() => setFormatMenuOpen(!formatMenuOpen)}
                disabled={generating !== null}
                className="min-w-[220px]"
              >
                {generating ? (
                  <>Generating {generating.toUpperCase()}...</>
                ) : (
                  <>Download Resume <ChevronDown className="w-4 h-4" /></>
                )}
              </PrimaryButton>

              {formatMenuOpen && !generating && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-full glass-card overflow-hidden z-10">
                  <button
                    onClick={() => handleGenerate("pdf")}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-200 hover:bg-accent-orange/10 hover:text-accent-orange-light transition-colors"
                  >
                    <FileText className="w-4 h-4" /> Download as PDF
                  </button>
                  <button
                    onClick={() => handleGenerate("docx")}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-200 hover:bg-accent-orange/10 hover:text-accent-orange-light transition-colors border-t border-white/[0.06]"
                  >
                    <FileText className="w-4 h-4" /> Download as DOCX
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
          
      </GlowCard>

      <div className="flex justify-between mt-6">
        <SecondaryButton onClick={back} disabled={step === 0}><ChevronLeft className="w-4 h-4" /> Back</SecondaryButton>
        {step < STEPS.length - 1 && (
          <PrimaryButton onClick={next}>Next <ChevronRight className="w-4 h-4" /></PrimaryButton>
        )}
      </div>
    </div>
  );
}
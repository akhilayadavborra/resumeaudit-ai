import React, { useState } from "react";
import { Plus, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";
import Input from "../common/Input";
import { SecondaryButton, PrimaryButton } from "../ui/GlowButton";
import api from "../../services/api";

function BulletInput({ value, onChange, onRemove }) {
  const [check, setCheck] = useState(null);
  const [checking, setChecking] = useState(false);

  const runCheck = async () => {
    if (!value.trim()) return;
    setChecking(true);
    try {
      const { data } = await api.post(`/api/builder/check-bullet?bullet=${encodeURIComponent(value)}`);
      setCheck(data);
    } catch {
      setCheck(null);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="mb-2">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => { onChange(e.target.value); setCheck(null); }}
          onBlur={runCheck}
          className="input-field flex-1 text-sm"
          placeholder="e.g. Led migration of legacy system, reducing downtime by 30%"
        />
        <button onClick={onRemove} type="button" className="p-2 text-gray-500 hover:text-red-400 shrink-0">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {checking && <p className="text-xs text-gray-500 mt-1">Checking...</p>}
      {check && !checking && (
        <p className={`text-xs mt-1 flex items-center gap-1.5 ${check.is_weak ? "text-orange-400" : "text-accent-amber"}`}>
          {check.is_weak ? <AlertTriangle className="w-3 h-3 shrink-0" /> : <CheckCircle2 className="w-3 h-3 shrink-0" />}
          {check.is_weak ? check.reason : "Strong bullet point!"}
          {check.example_fix && <span className="text-gray-500"> — try: "{check.example_fix}"</span>}
        </p>
      )}
    </div>
  );
}

export default function ExperienceStep({ experience, setExperience }) {
  const addEntry = () => setExperience([...experience, { company: "", title: "", start_date: "", end_date: "Present", bullets: [""] }]);
  const removeEntry = (i) => setExperience(experience.filter((_, idx) => idx !== i));
  const updateEntry = (i, field, val) => {
    const updated = [...experience];
    updated[i][field] = val;
    setExperience(updated);
  };
  const addBullet = (i) => {
    const updated = [...experience];
    updated[i].bullets.push("");
    setExperience(updated);
  };
  const updateBullet = (i, bi, val) => {
    const updated = [...experience];
    updated[i].bullets[bi] = val;
    setExperience(updated);
  };
  const removeBullet = (i, bi) => {
    const updated = [...experience];
    updated[i].bullets = updated[i].bullets.filter((_, idx) => idx !== bi);
    setExperience(updated);
  };

  return (
    <div className="space-y-6">
      {experience.map((exp, i) => (
        <div key={i} className="rounded-xl border border-white/[0.08] p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-400">Experience #{i + 1}</span>
            <button onClick={() => removeEntry(i)} type="button" className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <Input placeholder="Job Title" value={exp.title} onChange={(e) => updateEntry(i, "title", e.target.value)} />
            <Input placeholder="Company" value={exp.company} onChange={(e) => updateEntry(i, "company", e.target.value)} />
            <Input placeholder="Start Date (e.g. Jan 2023)" value={exp.start_date} onChange={(e) => updateEntry(i, "start_date", e.target.value)} />
            <Input placeholder="End Date (or 'Present')" value={exp.end_date} onChange={(e) => updateEntry(i, "end_date", e.target.value)} />
          </div>
          <label className="text-xs text-gray-500 mb-1.5 block">Bullet Points (check happens when you click away from the field)</label>
          {exp.bullets.map((b, bi) => (
            <BulletInput key={bi} value={b} onChange={(val) => updateBullet(i, bi, val)} onRemove={() => removeBullet(i, bi)} />
          ))}
          <SecondaryButton type="button" onClick={() => addBullet(i)} className="!py-1.5 !px-3 text-xs mt-1">
            <Plus className="w-3.5 h-3.5" /> Add Bullet
          </SecondaryButton>
        </div>
      ))}
      <PrimaryButton type="button" onClick={addEntry} className="w-full">
        <Plus className="w-4 h-4" /> Add Work Experience
      </PrimaryButton>
    </div>
  );
}
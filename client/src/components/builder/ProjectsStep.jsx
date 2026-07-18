import React from "react";
import { Plus, Trash2 } from "lucide-react";
import Input from "../common/Input";
import { PrimaryButton, SecondaryButton } from "../ui/GlowButton";

export default function ProjectsStep({ projects, setProjects }) {
  const addEntry = () => setProjects([...projects, { name: "", description: "", bullets: [""] }]);
  const removeEntry = (i) => setProjects(projects.filter((_, idx) => idx !== i));
  const updateEntry = (i, field, val) => {
    const updated = [...projects];
    updated[i][field] = val;
    setProjects(updated);
  };
  const addBullet = (i) => {
    const updated = [...projects];
    updated[i].bullets.push("");
    setProjects(updated);
  };
  const updateBullet = (i, bi, val) => {
    const updated = [...projects];
    updated[i].bullets[bi] = val;
    setProjects(updated);
  };

  return (
    <div className="space-y-4">
      {projects.map((proj, i) => (
        <div key={i} className="rounded-xl border border-white/[0.08] p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-400">Project #{i + 1}</span>
            <button onClick={() => removeEntry(i)} type="button" className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
          </div>
          <Input placeholder="Project Name" value={proj.name} onChange={(e) => updateEntry(i, "name", e.target.value)} className="mb-3" />
          <Input placeholder="Short description (optional)" value={proj.description} onChange={(e) => updateEntry(i, "description", e.target.value)} className="mb-3" />
          {proj.bullets.map((b, bi) => (
            <input
              key={bi}
              value={b}
              onChange={(e) => updateBullet(i, bi, e.target.value)}
              className="input-field text-sm mb-2"
              placeholder="e.g. Built a REST API handling 500+ requests/min"
            />
          ))}
          <SecondaryButton type="button" onClick={() => addBullet(i)} className="!py-1.5 !px-3 text-xs">
            <Plus className="w-3.5 h-3.5" /> Add Bullet
          </SecondaryButton>
        </div>
      ))}
      <PrimaryButton type="button" onClick={addEntry} className="w-full">
        <Plus className="w-4 h-4" /> Add Project
      </PrimaryButton>
    </div>
  );
}
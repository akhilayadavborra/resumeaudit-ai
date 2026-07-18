import React from "react";
import { Plus, Trash2 } from "lucide-react";
import Input from "../common/Input";
import { PrimaryButton } from "../ui/GlowButton";

export default function EducationStep({ education, setEducation }) {
  const addEntry = () => setEducation([...education, { school: "", degree: "", start_date: "", end_date: "" }]);
  const removeEntry = (i) => setEducation(education.filter((_, idx) => idx !== i));
  const updateEntry = (i, field, val) => {
    const updated = [...education];
    updated[i][field] = val;
    setEducation(updated);
  };

  return (
    <div className="space-y-4">
      {education.map((edu, i) => (
        <div key={i} className="rounded-xl border border-white/[0.08] p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-400">Education #{i + 1}</span>
            <button onClick={() => removeEntry(i)} type="button" className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input placeholder="Degree (e.g. B.S. Computer Science)" value={edu.degree} onChange={(e) => updateEntry(i, "degree", e.target.value)} />
            <Input placeholder="School" value={edu.school} onChange={(e) => updateEntry(i, "school", e.target.value)} />
            <Input placeholder="Start Date" value={edu.start_date} onChange={(e) => updateEntry(i, "start_date", e.target.value)} />
            <Input placeholder="End Date" value={edu.end_date} onChange={(e) => updateEntry(i, "end_date", e.target.value)} />
          </div>
        </div>
      ))}
      <PrimaryButton type="button" onClick={addEntry} className="w-full">
        <Plus className="w-4 h-4" /> Add Education
      </PrimaryButton>
    </div>
  );
}
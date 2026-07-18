import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

export default function DragDrop({ file, setFile }) {
  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error("Only PDF and DOCX files under 5MB are supported.");
      return;
    }
    setFile(accepted[0]);
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  });

  if (file) {
    return (
      <div className="flex items-center justify-between bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-accent-amber" />
          <div>
            <p className="text-gray-200 font-medium">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
        </div>
        <button onClick={() => setFile(null)} className="text-gray-500 hover:text-red-400"><X className="w-5 h-5" /></button>
      </div>
    );
  }

  return (
    <div {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
        isDragActive ? "border-accent-orange bg-accent-orange/5" : "border-white/15 hover:border-accent-orange/40"
      }`}>
      <input {...getInputProps()} />
      <UploadCloud className="w-12 h-12 text-accent-orange mx-auto mb-4" />
      <p className="text-gray-200 font-medium">{isDragActive ? "Drop your resume here" : "Drag & drop your resume, or click to browse"}</p>
      <p className="text-sm text-gray-500 mt-2">PDF or DOCX — max 5MB</p>
    </div>
  );
}
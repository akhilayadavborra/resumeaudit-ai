import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { PrimaryButton } from "../components/ui/GlowButton";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-orange to-accent-amber">404</h1>
        <p className="text-gray-400 mt-3">This page doesn't exist.</p>
        <Link to="/"><PrimaryButton className="mt-8">Back to Home</PrimaryButton></Link>
      </div>
    </MainLayout>
  );
}
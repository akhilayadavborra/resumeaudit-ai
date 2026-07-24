import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Signup from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import Dashboard from "../pages/Dashboard";
import Upload from "../pages/Upload";
import Analysis from "../pages/Analysis";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import History from "../pages/History";
import Compare from "../pages/Compare";
import Builder from "../pages/Builder";
import TailorResume from "../pages/TailorResume";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
      <Route path="/analysis/:id" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/compare/:fromId/:toId" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
      <Route path="/builder" element={<ProtectedRoute><Builder /></ProtectedRoute>} />
      <Route path="/tailor" element={<ProtectedRoute><TailorResume /></ProtectedRoute>} />
    </Routes>
  );
}
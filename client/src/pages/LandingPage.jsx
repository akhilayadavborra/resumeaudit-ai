import React from "react";
import MainLayout from "../layouts/MainLayout";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Stats from "../components/landing/Stats";
import Testimonials from "../components/landing/Testimonials";
import FAQ from "../components/landing/FAQ";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <MainLayout>
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </MainLayout>
  );
}
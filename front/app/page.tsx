"use client";

import { ArticlesSection } from "@/app/components/dashboard/visitor/ArticlesSection";
import { HeroSection } from "@/app/components/dashboard/visitor/HeroSection";

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <ArticlesSection />
    </div>
  );
}

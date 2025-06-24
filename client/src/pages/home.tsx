import { useState } from "react";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import RandomMapSection from "@/components/random-map-section";
import DiscoverySection from "@/components/discovery-section";

export default function Home() {
  const [currentSection, setCurrentSection] = useState<'home' | 'random' | 'discovery'>('home');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={setCurrentSection} />
      {currentSection === 'home' && <HeroSection onNavigate={setCurrentSection} />}
      {currentSection === 'random' && <RandomMapSection onBack={() => setCurrentSection('home')} />}
      {currentSection === 'discovery' && <DiscoverySection onBack={() => setCurrentSection('home')} />}
    </div>
  );
}

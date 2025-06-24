import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import MapSection from "@/components/map-section";
import SwipeSection from "@/components/swipe-section";
import PopularDestinations from "@/components/popular-destinations";
import FeaturesSection from "@/components/features-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <MapSection />
      <SwipeSection />
      <PopularDestinations />
      <FeaturesSection />
      <Footer />
    </div>
  );
}

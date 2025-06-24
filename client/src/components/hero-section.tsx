import { Button } from "@/components/ui/button";
import { MapPin, Heart } from "lucide-react";

interface HeroSectionProps {
  onNavigate: (section: 'home' | 'random' | 'discovery') => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-navy mb-6 korean-heading">
            새로운 여행지를<br />
            <span className="text-primary">발견해보세요</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto korean-text">
            랜덤 다트 던지기나 취향 기반 스와이프로 당신만의 완벽한 여행지를 찾아보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => onNavigate('random')}
              className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg h-auto korean-text"
            >
              <MapPin className="mr-2 h-5 w-5" />
              랜덤 여행지 추천
            </Button>
            <Button 
              onClick={() => onNavigate('discovery')}
              variant="outline"
              className="bg-white text-navy px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg border-2 border-gray-200 h-auto korean-text"
            >
              <Heart className="mr-2 h-5 w-5" />
              취향별 찾기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

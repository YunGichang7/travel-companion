import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary korean-heading">TripPick</h1>
            <span className="ml-2 text-sm text-gray-500">🌍</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('random')}
              className="text-gray-600 hover:text-primary transition-colors korean-text"
            >
              랜덤 추천
            </button>
            <button 
              onClick={() => scrollToSection('discover')}
              className="text-gray-600 hover:text-primary transition-colors korean-text"
            >
              여행지 찾기
            </button>
            <button 
              onClick={() => scrollToSection('destinations')}
              className="text-gray-600 hover:text-primary transition-colors korean-text"
            >
              인기 여행지
            </button>
          </nav>
          
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white py-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('random')}
                className="text-gray-600 hover:text-primary transition-colors korean-text text-left"
              >
                랜덤 추천
              </button>
              <button 
                onClick={() => scrollToSection('discover')}
                className="text-gray-600 hover:text-primary transition-colors korean-text text-left"
              >
                여행지 찾기
              </button>
              <button 
                onClick={() => scrollToSection('destinations')}
                className="text-gray-600 hover:text-primary transition-colors korean-text text-left"
              >
                인기 여행지
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

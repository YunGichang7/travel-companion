import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onNavigate: (section: 'home' | 'random' | 'discovery') => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (section: 'home' | 'random' | 'discovery') => {
    onNavigate(section);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('home')}
              className="flex items-center focus:outline-none"
            >
              <h1 className="text-2xl font-bold text-primary korean-heading">TripPick</h1>
              <span className="ml-2 text-sm text-gray-500">🌍</span>
            </button>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavigation('random')}
              className="text-gray-600 hover:text-primary transition-colors korean-text"
            >
              랜덤 추천
            </button>
            <button 
              onClick={() => handleNavigation('discovery')}
              className="text-gray-600 hover:text-primary transition-colors korean-text"
            >
              여행지 찾기
            </button>
            <button 
              onClick={() => handleNavigation('home')}
              className="text-gray-600 hover:text-primary transition-colors korean-text"
            >
              홈
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
                onClick={() => handleNavigation('random')}
                className="text-gray-600 hover:text-primary transition-colors korean-text text-left"
              >
                랜덤 추천
              </button>
              <button 
                onClick={() => handleNavigation('discovery')}
                className="text-gray-600 hover:text-primary transition-colors korean-text text-left"
              >
                여행지 찾기
              </button>
              <button 
                onClick={() => handleNavigation('home')}
                className="text-gray-600 hover:text-primary transition-colors korean-text text-left"
              >
                홈
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

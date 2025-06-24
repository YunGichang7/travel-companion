import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, X, Heart, MapPin } from "lucide-react";
import { Destination } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface DiscoverySectionProps {
  onBack: () => void;
}

// Korean regions with their coordinates and colors
const koreanRegions = [
  { id: "seoul", name: "서울", x: 50, y: 30, color: "bg-red-500" },
  { id: "gyeonggi", name: "경기도", x: 45, y: 35, color: "bg-blue-500" },
  { id: "incheon", name: "인천", x: 40, y: 32, color: "bg-green-500" },
  { id: "gangwon", name: "강원도", x: 60, y: 25, color: "bg-purple-500" },
  { id: "chungbuk", name: "충청북도", x: 50, y: 45, color: "bg-yellow-500" },
  { id: "chungnam", name: "충청남도", x: 40, y: 45, color: "bg-pink-500" },
  { id: "daejeon", name: "대전", x: 45, y: 48, color: "bg-indigo-500" },
  { id: "sejong", name: "세종", x: 42, y: 46, color: "bg-orange-500" },
  { id: "jeonbuk", name: "전라북도", x: 40, y: 55, color: "bg-teal-500" },
  { id: "jeonnam", name: "전라남도", x: 35, y: 65, color: "bg-cyan-500" },
  { id: "gwangju", name: "광주", x: 38, y: 62, color: "bg-lime-500" },
  { id: "gyeongbuk", name: "경상북도", x: 65, y: 45, color: "bg-rose-500" },
  { id: "gyeongnam", name: "경상남도", x: 60, y: 60, color: "bg-violet-500" },
  { id: "busan", name: "부산", x: 70, y: 65, color: "bg-amber-500" },
  { id: "daegu", name: "대구", x: 65, y: 52, color: "bg-emerald-500" },
  { id: "ulsan", name: "울산", x: 72, y: 58, color: "bg-slate-500" },
  { id: "jeju", name: "제주도", x: 25, y: 85, color: "bg-fuchsia-500" }
];

export default function DiscoverySection({ onBack }: DiscoverySectionProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showSwipeCards, setShowSwipeCards] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [likedPreferences, setLikedPreferences] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: destinations = [] } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });

  const swipeMutation = useMutation({
    mutationFn: async ({ destinationId, action }: { destinationId: number; action: 'like' | 'pass' }) => {
      const response = await apiRequest('POST', '/api/swipe', {
        destinationId,
        action,
        sessionId
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/liked', sessionId] });
    }
  });

  // Filter destinations based on selected region and user preferences
  const filteredDestinations = destinations.filter(dest => {
    if (selectedRegion && dest.region !== selectedRegion) return false;
    return true;
  }).sort(() => Math.random() - 0.5); // Randomize order

  // Get refined destinations based on user preferences
  const getRefinedDestinations = () => {
    if (likedPreferences.length === 0) return filteredDestinations;
    
    return filteredDestinations.filter(dest => 
      dest.tags.some(tag => likedPreferences.includes(tag)) ||
      likedPreferences.includes(dest.category)
    );
  };

  const currentDestinations = getRefinedDestinations();
  const currentCard = currentDestinations[currentCardIndex];

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId);
  };

  const handleStartDiscovery = () => {
    if (!selectedRegion) return;
    setShowSwipeCards(true);
    setCurrentCardIndex(0);
    setLikedPreferences([]);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentCardIndex >= currentDestinations.length) return;
    
    const destination = currentDestinations[currentCardIndex];
    setSwipeDirection(direction);
    
    // Record swipe action
    swipeMutation.mutate({
      destinationId: destination.id,
      action: direction === 'right' ? 'like' : 'pass'
    });

    // Update preferences based on likes
    if (direction === 'right') {
      const newPreferences = [...likedPreferences];
      destination.tags.forEach(tag => {
        if (!newPreferences.includes(tag)) {
          newPreferences.push(tag);
        }
      });
      if (!newPreferences.includes(destination.category)) {
        newPreferences.push(destination.category);
      }
      setLikedPreferences(newPreferences);
    }

    // Animate and move to next card
    setTimeout(() => {
      setCurrentCardIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 300);
  };

  if (showSwipeCards) {
    if (currentCardIndex >= currentDestinations.length) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-navy mb-8 korean-heading">
                취향 분석 완료!
              </h2>
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h3 className="text-xl font-semibold mb-4 korean-heading">당신이 좋아하는 여행 스타일</h3>
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {likedPreferences.map((pref, index) => (
                    <Badge key={index} variant="secondary" className="korean-text text-sm">
                      {pref}
                    </Badge>
                  ))}
                </div>
                <p className="text-gray-600 korean-text">
                  이런 스타일의 여행지들을 추천해드릴게요!
                </p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => {
                    setShowSwipeCards(false);
                    setCurrentCardIndex(0);
                  }}
                  className="bg-primary text-white korean-text"
                >
                  다시 시작하기
                </Button>
                <Button 
                  onClick={onBack}
                  variant="outline"
                  className="korean-text"
                >
                  홈으로 돌아가기
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <Button 
              onClick={() => setShowSwipeCards(false)}
              variant="ghost" 
              className="korean-text"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              지역 선택으로
            </Button>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-navy korean-heading">취향별 여행지 찾기</h2>
              <p className="text-sm text-gray-500 korean-text">
                {currentCardIndex + 1} / {currentDestinations.length}
              </p>
            </div>
            <div className="w-20"></div>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="relative h-[600px]">
              {currentCard && (
                <div className={`absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden transform transition-transform duration-300 ${
                  swipeDirection === 'left' ? 'swipe-left' : swipeDirection === 'right' ? 'swipe-right' : ''
                }`}>
                  <img 
                    src={currentCard.imageUrl} 
                    alt={currentCard.nameKorean} 
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-navy mb-2 korean-heading">
                      {currentCard.nameKorean}
                    </h3>
                    <p className="text-gray-600 mb-4 korean-text">
                      {currentCard.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentCard.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="korean-text">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="korean-text">{currentCard.region}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        ⭐ {currentCard.rating}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Swipe Action Buttons */}
            <div className="flex gap-4 justify-center mt-8">
              <Button
                onClick={() => handleSwipe('left')}
                className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors p-0"
                variant="outline"
              >
                <X className="w-6 h-6" />
              </Button>
              <Button
                onClick={() => handleSwipe('right')}
                className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors p-0"
                variant="outline"
              >
                <Heart className="w-6 h-6" />
              </Button>
            </div>
            
            {/* Swipe Instructions */}
            <div className="text-center mt-4">
              <div className="bg-black/60 text-white px-4 py-2 rounded-full text-sm korean-text inline-block">
                ← 넘기기 | 좋아요 →
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="mr-4 korean-text"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
          <h1 className="text-3xl font-bold text-navy korean-heading">💕 취향별 여행지 찾기</h1>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-700 korean-text mb-2">
            여행하고 싶은 지역 범위를 설정해주세요
          </h2>
          <p className="text-gray-500 korean-text">
            지역을 선택한 후 소개팅 앱처럼 스와이프해보세요!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Interactive Map */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="relative h-96 bg-gradient-to-b from-sky-100 to-green-100 rounded-xl border-2 border-gray-200 overflow-hidden">
              {/* Map Background */}
              <div className="absolute inset-0 opacity-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M20,20 Q50,10 80,20 Q90,50 80,80 Q50,90 20,80 Q10,50 20,20" 
                        fill="currentColor" className="text-green-200" />
                </svg>
              </div>
              
              {/* Regions */}
              {koreanRegions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleRegionClick(region.id)}
                  className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-300 hover:scale-150 z-10 ${
                    region.color
                  } ${
                    selectedRegion === region.id 
                      ? 'scale-150 ring-4 ring-pink-400 ring-opacity-50' 
                      : 'hover:ring-2 hover:ring-gray-300'
                  }`}
                  style={{ 
                    left: `${region.x}%`, 
                    top: `${region.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={region.name}
                />
              ))}
            </div>
            
            {/* Selected Region Display */}
            {selectedRegion && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 korean-text mb-2">선택된 지역:</p>
                <Badge variant="outline" className="text-lg px-4 py-2 korean-text">
                  {koreanRegions.find(r => r.id === selectedRegion)?.name}
                </Badge>
              </div>
            )}
          </div>
          
          {/* Start Discovery Button */}
          <div className="text-center">
            <Button 
              onClick={handleStartDiscovery}
              disabled={!selectedRegion}
              className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg h-auto korean-text"
            >
              <Heart className="mr-2 h-5 w-5" />
              {selectedRegion ? '취향 찾기 시작!' : '먼저 지역을 선택해주세요'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, Crosshair } from "lucide-react";
import { Destination } from "@shared/schema";

interface RandomMapSectionProps {
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

export default function RandomMapSection({ onBack }: RandomMapSectionProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isThrowingDart, setIsThrowingDart] = useState(false);
  const [dartPosition, setDartPosition] = useState<{ x: number; y: number } | null>(null);
  const [randomResult, setRandomResult] = useState<Destination | null>(null);

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId);
    setRandomResult(null);
    setDartPosition(null);
  };

  const handleThrowDart = async () => {
    if (!selectedRegion) return;
    
    setIsThrowingDart(true);
    setRandomResult(null);
    
    // Generate random dart position within the selected region
    const region = koreanRegions.find(r => r.id === selectedRegion);
    if (region) {
      const dartX = region.x + (Math.random() - 0.5) * 10;
      const dartY = region.y + (Math.random() - 0.5) * 10;
      setDartPosition({ x: dartX, y: dartY });
    }
    
    // Simulate dart throwing animation delay
    setTimeout(async () => {
      try {
        const regionParam = selectedRegion === "all" ? "" : selectedRegion;
        const queryParams = regionParam ? `?region=${regionParam}` : "";
        const response = await fetch(`/api/destinations/random${queryParams}`);
        
        if (response.ok) {
          const destination = await response.json();
          setRandomResult(destination);
        }
      } catch (error) {
        console.error('Failed to get random destination:', error);
      } finally {
        setIsThrowingDart(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
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
          <h1 className="text-3xl font-bold text-navy korean-heading">🎯 랜덤 여행지 추천</h1>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-700 korean-text mb-2">
            여행하고 싶은 지역 범위를 설정해주세요
          </h2>
          <p className="text-gray-500 korean-text">
            지도에서 원하는 지역을 클릭한 후 다트를 던져보세요!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Interactive Map */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-8">
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
                        ? 'scale-150 ring-4 ring-yellow-400 ring-opacity-50' 
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
                
                {/* Dart Position */}
                {dartPosition && (
                  <div 
                    className="absolute w-4 h-4 text-red-600 z-20 dart-throw-animation"
                    style={{ 
                      left: `${dartPosition.x}%`, 
                      top: `${dartPosition.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <Target className="w-4 h-4" />
                  </div>
                )}
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
            
            {/* Dart Throw Button */}
            <Button 
              onClick={handleThrowDart}
              disabled={!selectedRegion || isThrowingDart}
              className="w-full mt-6 bg-primary text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg h-auto korean-text"
            >
              <Crosshair className="mr-2 h-5 w-5" />
              {isThrowingDart ? '다트 던지는 중...' : '🎯 다트 던지기!'}
            </Button>
          </div>
          
          {/* Result Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-navy mb-4 korean-heading">🎲 추천 결과</h3>
              
              {!randomResult && !isThrowingDart && (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-300 mb-4 mx-auto" />
                  <p className="text-gray-500 korean-text">
                    {selectedRegion ? '다트를 던져서 여행지를 발견해보세요!' : '먼저 지역을 선택해주세요!'}
                  </p>
                </div>
              )}
              
              {isThrowingDart && (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500 korean-text">여행지를 찾고 있어요...</p>
                </div>
              )}
              
              {randomResult && (
                <Card className="overflow-hidden">
                  <img 
                    src={randomResult.imageUrl} 
                    alt={randomResult.nameKorean} 
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold text-navy mb-2 korean-heading">
                      {randomResult.nameKorean}
                    </h4>
                    <p className="text-gray-600 mb-4 korean-text">
                      {randomResult.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {randomResult.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="korean-text">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 korean-text">
                        평점: ⭐ {randomResult.rating}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
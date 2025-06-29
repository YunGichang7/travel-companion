import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, X, Heart, MapPin, Share2, MessageCircle, Camera } from "lucide-react";
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
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  // Ensure selectedRegion and svgRef are at the top of the main component
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [showSwipeCards, setShowSwipeCards] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [likedPreferences, setLikedPreferences] = useState<string[]>([]);
  const [finalRecommendation, setFinalRecommendation] = useState<Destination | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isSwipeInProgress, setIsSwipeInProgress] = useState(false);
  const queryClient = useQueryClient();
  
  // Touch/mouse gesture refs
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 400;
    const height = 500;

    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const projection = d3
      .geoMercator()
      .center([127.5, 36.3])
      .scale(3000)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    d3.json('/korea.topojson').then((topo: any) => {
      const geo = feature(topo, topo.objects["skorea_provinces_2018_geo"]) as any;

      svg
        .selectAll('path')
        .data(geo.features)
        .join('path')
        .attr('d', path as any)
        .attr('fill', (d: any) =>
          selectedRegions.includes(d.properties.name) ? '#f9a8d4' : 'transparent'
        )
        .attr('stroke', '#555')
        .attr('stroke-width', 0.8)
        .on('click', (_evt, d: any) => {
          const region = d.properties.name;
          setSelectedRegions(prev =>
            prev.includes(region)
              ? prev.filter(r => r !== region)
              : [...prev, region]
          );
        });
    });
  }, [selectedRegions]);
  const startX = useRef<number>(0);
  const currentX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

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

  // Filter destinations based on selected regions and user preferences
  const filteredDestinations = destinations.filter(dest => {
    if (selectedRegions.length > 0 && !selectedRegions.includes(dest.region)) return false;
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
    setSelectedRegions(prev => {
      if (prev.includes(regionId)) {
        return prev.filter(id => id !== regionId);
      } else {
        return [...prev, regionId];
      }
    });
  };

  const handleStartDiscovery = () => {
    if (selectedRegions.length === 0) return;
    setShowSwipeCards(true);
    setCurrentCardIndex(0);
    setLikedPreferences([]);
  };

  const generateFinalRecommendation = () => {
    const refinedDestinations = getRefinedDestinations();
    if (refinedDestinations.length > 0) {
      const randomIndex = Math.floor(Math.random() * refinedDestinations.length);
      setFinalRecommendation(refinedDestinations[randomIndex]);
      setShowResultModal(true);
    }
  };

  const handleShare = (platform: 'instagram' | 'kakao') => {
    if (!finalRecommendation) return;
    
    const shareText = `TripPick에서 발견한 여행지: ${finalRecommendation.nameKorean}\n${finalRecommendation.description}`;
    const shareUrl = window.location.href;
    
    if (platform === 'instagram') {
      // Instagram doesn't support direct sharing URLs, so we copy to clipboard
      navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      alert('Instagram 공유용 텍스트가 클립보드에 복사되었습니다!');
    } else if (platform === 'kakao') {
      const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(kakaoUrl, '_blank');
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentCardIndex >= currentDestinations.length || isSwipeInProgress) return;
    
    const destination = currentDestinations[currentCardIndex];
    setIsSwipeInProgress(true);
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
      setIsSwipeInProgress(false);
    }, 300);
  };

  // Touch and mouse event handlers for swipe gestures
  const handleStart = (clientX: number) => {
    if (isSwipeInProgress) return;
    startX.current = clientX;
    currentX.current = clientX;
    isDragging.current = true;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging.current || isSwipeInProgress) return;
    currentX.current = clientX;
    const deltaX = currentX.current - startX.current;
    
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.1}deg)`;
      cardRef.current.style.opacity = `${Math.max(0.3, 1 - Math.abs(deltaX) / 300)}`;
    }
  };

  const handleEnd = () => {
    if (!isDragging.current || isSwipeInProgress) return;
    isDragging.current = false;
    
    const deltaX = currentX.current - startX.current;
    const threshold = 100;
    
    if (cardRef.current) {
      cardRef.current.style.transform = '';
      cardRef.current.style.opacity = '';
    }
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        handleSwipe('right');
      } else {
        handleSwipe('left');
      }
    }
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
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
                <p className="text-gray-600 korean-text mb-6">
                  이런 스타일의 여행지들을 추천해드릴게요!
                </p>
                <Button 
                  onClick={generateFinalRecommendation}
                  className="bg-primary text-white korean-text px-8 py-3"
                >
                  🎯 맞춤 여행지 추천받기
                </Button>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => {
                    setShowSwipeCards(false);
                    setCurrentCardIndex(0);
                  }}
                  variant="outline"
                  className="korean-text"
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
                <div 
                  ref={cardRef}
                  className={`absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden transform transition-transform duration-300 cursor-grab active:cursor-grabbing select-none ${
                    swipeDirection === 'left' ? 'swipe-left' : swipeDirection === 'right' ? 'swipe-right' : ''
                  } ${isSwipeInProgress ? (swipeDirection === 'right' ? 'animate-pulse bg-green-50' : 'animate-pulse bg-red-50') : ''}`}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="relative">
                    <img 
                      src={currentCard.imageUrl} 
                      alt={currentCard.nameKorean} 
                      className="w-full h-72 object-cover pointer-events-none"
                      draggable={false}
                    />
                    
                    {/* Swipe indicators */}
                    {isDragging.current && (
                      <>
                        <div className={`absolute top-1/2 left-4 transform -translate-y-1/2 ${
                          currentX.current - startX.current < -50 ? 'opacity-100' : 'opacity-0'
                        } transition-opacity duration-200`}>
                          <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">PASS</div>
                        </div>
                        <div className={`absolute top-1/2 right-4 transform -translate-y-1/2 ${
                          currentX.current - startX.current > 50 ? 'opacity-100' : 'opacity-0'
                        } transition-opacity duration-200`}>
                          <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">LIKE</div>
                        </div>
                      </>
                    )}
                  </div>
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
            <div className="mt-8 flex justify-center">
              <svg ref={svgRef} className="border rounded-md shadow-md" />
            </div>
            {/* Selected Regions Display */}
            {selectedRegions.length > 0 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 korean-text mb-2">선택된 지역:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedRegions.map((regionId, index) => (
                    <Badge key={regionId ?? index} variant="outline" className="text-sm px-3 py-1 korean-text">
                      {koreanRegions.find(r => r.id === regionId)?.name || regionId}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Start Discovery Button */}
          <div className="text-center">
            <Button 
              onClick={handleStartDiscovery}
              disabled={selectedRegions.length === 0}
              className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg h-auto korean-text"
            >
              <Heart className="mr-2 h-5 w-5" />
              {selectedRegions.length > 0 ? '취향 찾기 시작!' : '먼저 지역을 선택해주세요'}
            </Button>
          </div>
        </div>
      </div>

      {/* Result Modal with Sharing */}
      <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center korean-heading text-xl text-navy">
              🎉 당신을 위한 맞춤 여행지
            </DialogTitle>
          </DialogHeader>
          
          {finalRecommendation && (
            <div className="space-y-4">
              <img 
                src={finalRecommendation.imageUrl} 
                alt={finalRecommendation.nameKorean} 
                className="w-full h-48 object-cover rounded-lg"
              />
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-navy mb-2 korean-heading">
                  {finalRecommendation.nameKorean}
                </h3>
                <p className="text-gray-600 mb-4 korean-text">
                  {finalRecommendation.description}
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {finalRecommendation.tags.map((tag, i) => (
                    <Badge key={tag + i} variant="secondary" className="korean-text text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="korean-text">{finalRecommendation.region}</span>
                  </div>
                  <div>⭐ {finalRecommendation.rating}</div>
                </div>
              </div>
              
              {/* Sharing Buttons */}
              <div className="space-y-3">
                <p className="text-center text-sm text-gray-600 korean-text">친구들과 공유해보세요!</p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => handleShare('instagram')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg korean-text flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Instagram
                  </Button>
                  <Button
                    onClick={() => handleShare('kakao')}
                    className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-lg korean-text flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    카카오톡
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center pt-4">
                <Button
                  onClick={() => {
                    setShowResultModal(false);
                    setShowSwipeCards(false);
                    setCurrentCardIndex(0);
                    setSelectedRegions([]);
                  }}
                  variant="outline"
                  className="korean-text"
                >
                  새로 시작하기
                </Button>
                <Button
                  onClick={() => setShowResultModal(false)}
                  className="bg-primary text-white korean-text"
                >
                  닫기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
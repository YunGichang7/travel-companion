import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Heart, MapPin } from "lucide-react";
import { Destination } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function SwipeSection() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
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

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentCardIndex >= destinations.length) return;
    
    const currentDestination = destinations[currentCardIndex];
    setSwipeDirection(direction);
    
    // Record swipe action
    swipeMutation.mutate({
      destinationId: currentDestination.id,
      action: direction === 'right' ? 'like' : 'pass'
    });

    // Animate and move to next card
    setTimeout(() => {
      setCurrentCardIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 300);
  };

  const currentCard = destinations[currentCardIndex];
  const nextCard = destinations[currentCardIndex + 1];
  const thirdCard = destinations[currentCardIndex + 2];

  if (!destinations.length) {
    return (
      <section id="discover" className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 korean-text">여행지를 불러오는 중...</p>
          </div>
        </div>
      </section>
    );
  }

  if (currentCardIndex >= destinations.length) {
    return (
      <section id="discover" className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-navy mb-4 korean-heading">💕 취향별 여행지 찾기</h3>
          </div>
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-2xl font-bold text-navy mb-4 korean-heading">모든 여행지를 확인했어요!</h4>
            <p className="text-gray-600 mb-6 korean-text">좋아요를 누른 여행지들을 확인해보세요.</p>
            <Button 
              onClick={() => setCurrentCardIndex(0)}
              className="bg-primary text-white korean-text"
            >
              다시 시작하기
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="discover" className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-navy mb-4 korean-heading">💕 취향별 여행지 찾기</h3>
          <p className="text-gray-600 text-lg korean-text">소개팅 앱처럼 스와이프하며 당신의 취향을 찾아보세요</p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="relative h-[600px]">
            <div className="absolute inset-0">
              {/* Current Card */}
              {currentCard && (
                <div className={`absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] ${
                  swipeDirection === 'left' ? 'swipe-left' : swipeDirection === 'right' ? 'swipe-right' : ''
                }`}>
                  <img 
                    src={currentCard.imageUrl} 
                    alt={currentCard.nameKorean} 
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-6">
                    <h4 className="text-2xl font-bold text-navy mb-2 korean-heading">{currentCard.nameKorean}</h4>
                    <p className="text-gray-600 mb-4 korean-text">{currentCard.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentCard.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="korean-text">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="korean-text">{currentCard.region}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Next Card */}
              {nextCard && (
                <div className="absolute inset-0 bg-white rounded-2xl shadow-lg overflow-hidden transform scale-95 -translate-y-2 -z-10">
                  <img 
                    src={nextCard.imageUrl} 
                    alt={nextCard.nameKorean} 
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-6">
                    <h4 className="text-2xl font-bold text-navy mb-2 korean-heading">{nextCard.nameKorean}</h4>
                    <p className="text-gray-600 mb-4 korean-text">{nextCard.description}</p>
                  </div>
                </div>
              )}
              
              {/* Third Card */}
              {thirdCard && (
                <div className="absolute inset-0 bg-white rounded-2xl shadow-md overflow-hidden transform scale-90 -translate-y-4 -z-20">
                  <img 
                    src={thirdCard.imageUrl} 
                    alt={thirdCard.nameKorean} 
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-6">
                    <h4 className="text-2xl font-bold text-navy mb-2 korean-heading">{thirdCard.nameKorean}</h4>
                  </div>
                </div>
              )}
            </div>
            
            {/* Swipe Action Buttons */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
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
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-black/60 text-white px-4 py-2 rounded-full text-sm korean-text">
                ← 넘기기 | 좋아요 →
              </div>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2">
              {destinations.slice(0, 5).map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentCardIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2 korean-text">
              {Math.min(currentCardIndex + 1, destinations.length)} / {destinations.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

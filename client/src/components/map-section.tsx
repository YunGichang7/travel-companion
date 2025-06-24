import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crosshair, Dice6 } from "lucide-react";
import { Destination } from "@shared/schema";

export default function MapSection() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [randomResult, setRandomResult] = useState<Destination | null>(null);
  const [isThrowingDart, setIsThrowingDart] = useState(false);

  const handleThrowDart = async () => {
    setIsThrowingDart(true);
    
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
    }, 1000);
  };

  return (
    <section id="random" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-navy mb-4 korean-heading">🎯 랜덤 여행지 추천</h3>
          <p className="text-gray-600 text-lg korean-text">지도에서 원하는 지역을 선택하고 다트를 던져보세요!</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map Section */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 shadow-lg">
              <div className="relative h-96 bg-white rounded-xl shadow-inner p-4">
                <div className="absolute inset-4 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-b from-green-100 to-blue-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <Crosshair className="w-16 h-16 text-gray-400 mb-4 mx-auto" />
                      <p className="text-gray-500 font-medium korean-text">대한민국 지도</p>
                      <p className="text-sm text-gray-400 korean-text">지역을 클릭하세요</p>
                    </div>
                  </div>
                </div>
                
                <div className={`absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white transform transition-transform duration-500 hover:scale-110 ${isThrowingDart ? 'dart-throw-animation' : ''}`}>
                  <Crosshair className="w-4 h-4" />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 korean-text">선택된 지역</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="전체 지역" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 지역</SelectItem>
                    <SelectItem value="seoul">서울</SelectItem>
                    <SelectItem value="busan">부산</SelectItem>
                    <SelectItem value="jeju">제주도</SelectItem>
                    <SelectItem value="gangwon">강원도</SelectItem>
                    <SelectItem value="gyeonggi">경기도</SelectItem>
                    <SelectItem value="gyeongsang">경상도</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={handleThrowDart}
              disabled={isThrowingDart}
              className="w-full mt-6 bg-accent text-navy px-6 py-4 rounded-xl font-semibold text-lg hover:bg-accent/90 transition-all transform hover:scale-105 shadow-lg h-auto korean-text"
            >
              <Dice6 className="mr-2 h-5 w-5" />
              {isThrowingDart ? '다트 던지는 중...' : '🎯 다트 던지기!'}
            </Button>
          </div>
          
          {/* Result Section */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h4 className="text-xl font-semibold text-navy mb-4 korean-heading">🎲 추천 결과</h4>
              <div className="space-y-4">
                {!randomResult ? (
                  <div className="text-center py-12">
                    <Dice6 className="w-16 h-16 text-gray-300 mb-4 mx-auto" />
                    <p className="text-gray-500 korean-text">다트를 던져서 여행지를 발견해보세요!</p>
                  </div>
                ) : (
                  <Card className="overflow-hidden">
                    <img 
                      src={randomResult.imageUrl} 
                      alt={randomResult.nameKorean} 
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <h5 className="text-xl font-semibold text-navy mb-2 korean-heading">{randomResult.nameKorean}</h5>
                      <p className="text-gray-600 mb-4 korean-text">{randomResult.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 flex-wrap">
                          {randomResult.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="korean-text">{tag}</Badge>
                          ))}
                        </div>
                        <Button variant="link" className="text-primary hover:text-primary/80 font-medium korean-text p-0">
                          자세히 보기 →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

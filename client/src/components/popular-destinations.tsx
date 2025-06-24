import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Destination } from "@shared/schema";

export default function PopularDestinations() {
  const [activeFilter, setActiveFilter] = useState("전체");
  
  const { data: destinations = [] } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });

  const filters = ["전체", "자연", "문화/역사", "해변", "도시"];

  const filteredDestinations = destinations.filter(dest => {
    if (activeFilter === "전체") return true;
    return dest.category === activeFilter;
  });

  return (
    <section id="destinations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-navy mb-4 korean-heading">🔥 인기 여행지</h3>
          <p className="text-gray-600 text-lg korean-text">많은 사람들이 선택한 대한민국의 아름다운 여행지들</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <Button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              variant={activeFilter === filter ? "default" : "outline"}
              className={`px-6 py-2 rounded-full font-medium transition-colors korean-text ${
                activeFilter === filter 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>
        
        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img 
                src={destination.imageUrl} 
                alt={destination.nameKorean} 
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-semibold text-navy korean-heading">{destination.nameKorean}</h4>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{destination.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 korean-text">{destination.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    {destination.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs korean-text">{tag}</Badge>
                    ))}
                  </div>
                  <Button variant="link" className="text-primary hover:text-primary/80 text-sm font-medium korean-text p-0">
                    더보기 →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 korean-text">해당 카테고리의 여행지가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}

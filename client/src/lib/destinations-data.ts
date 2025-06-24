import { Destination } from "@shared/schema";

export const mockDestinations: Destination[] = [
  {
    id: 1,
    name: "Jeju Island",
    nameKorean: "제주도",
    description: "에메랄드빛 바다와 한라산이 어우러진 섬",
    region: "jeju",
    category: "자연",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    rating: 4.8,
    tags: ["섬", "자연", "해변", "산"],
    latitude: 33.4996,
    longitude: 126.5312
  },
  {
    id: 2,
    name: "Busan Haeundae",
    nameKorean: "부산 해운대",
    description: "도시와 바다가 만나는 아름다운 해변가",
    region: "busan",
    category: "해변",
    imageUrl: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    rating: 4.6,
    tags: ["해변", "도시", "야경"],
    latitude: 35.1584,
    longitude: 129.1590
  },
  {
    id: 3,
    name: "Bulguksa Temple",
    nameKorean: "경주 불국사",
    description: "신라시대 역사가 살아 숨쉬는 전통 사찰",
    region: "gyeongsang",
    category: "문화/역사",
    imageUrl: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    rating: 4.7,
    tags: ["역사", "문화", "사찰"],
    latitude: 35.7900,
    longitude: 129.3322
  },
  {
    id: 4,
    name: "Seoraksan National Park",
    nameKorean: "설악산 국립공원",
    description: "웅장한 산세와 단풍이 아름다운 국립공원",
    region: "gangwon",
    category: "자연",
    imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    rating: 4.5,
    tags: ["자연", "등산", "단풍"],
    latitude: 38.1198,
    longitude: 128.4653
  },
  {
    id: 5,
    name: "Seoul Myeongdong",
    nameKorean: "서울 명동",
    description: "쇼핑과 문화가 살아 숨쉬는 서울의 중심가",
    region: "seoul",
    category: "도시",
    imageUrl: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    rating: 4.6,
    tags: ["도시", "쇼핑", "문화"],
    latitude: 37.5636,
    longitude: 126.9822
  },
  {
    id: 6,
    name: "Andong Hahoe Village",
    nameKorean: "안동 하회마을",
    description: "조선시대 전통문화가 보존된 유네스코 세계문화유산",
    region: "gyeongsang",
    category: "문화/역사",
    imageUrl: "https://images.unsplash.com/photo-1578160112054-954a67602b88?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    rating: 4.7,
    tags: ["전통", "역사", "유네스코"],
    latitude: 36.5394,
    longitude: 128.5185
  },
  {
    id: 7,
    name: "Jinhae Cherry Blossom",
    nameKorean: "진해 벚꽃길",
    description: "봄철 전국 최고의 벚꽃 명소",
    region: "gyeongsang",
    category: "자연",
    imageUrl: "https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    rating: 4.9,
    tags: ["벚꽃", "자연", "봄"],
    latitude: 35.1463,
    longitude: 128.7036
  },
  {
    id: 8,
    name: "Ganghwa Island",
    nameKorean: "강화도",
    description: "역사와 자연이 공존하는 서해의 보석",
    region: "gyeonggi",
    category: "자연",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    rating: 4.4,
    tags: ["섬", "역사", "갯벌"],
    latitude: 37.7473,
    longitude: 126.4877
  }
];

import { destinations, swipeActions, type Destination, type InsertDestination, type SwipeAction, type InsertSwipeAction } from "@shared/schema";

export interface IStorage {
  // Destinations
  getAllDestinations(): Promise<Destination[]>;
  getDestinationById(id: number): Promise<Destination | undefined>;
  getDestinationsByRegion(region: string): Promise<Destination[]>;
  getDestinationsByCategory(category: string): Promise<Destination[]>;
  getRandomDestination(region?: string): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  
  // Swipe actions
  getSwipeActionsBySession(sessionId: string): Promise<SwipeAction[]>;
  createSwipeAction(swipeAction: InsertSwipeAction): Promise<SwipeAction>;
  getLikedDestinations(sessionId: string): Promise<Destination[]>;
}

export class MemStorage implements IStorage {
  private destinations: Map<number, Destination>;
  private swipeActions: Map<number, SwipeAction>;
  private currentDestinationId: number;
  private currentSwipeActionId: number;

  constructor() {
    this.destinations = new Map();
    this.swipeActions = new Map();
    this.currentDestinationId = 1;
    this.currentSwipeActionId = 1;
    
    // Initialize with Korean destinations
    this.initializeDestinations();
  }

  private initializeDestinations() {
    const initialDestinations: InsertDestination[] = [
      {
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

    initialDestinations.forEach(dest => {
      this.createDestination(dest);
    });
  }

  async getAllDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getDestinationById(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async getDestinationsByRegion(region: string): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(dest => dest.region === region);
  }

  async getDestinationsByCategory(category: string): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(dest => dest.category === category);
  }

  async getRandomDestination(region?: string): Promise<Destination | undefined> {
    let destinations = Array.from(this.destinations.values());
    if (region) {
      destinations = destinations.filter(dest => dest.region === region);
    }
    if (destinations.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * destinations.length);
    return destinations[randomIndex];
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const id = this.currentDestinationId++;
    const destination: Destination = { 
      ...insertDestination, 
      id,
      latitude: insertDestination.latitude ?? null,
      longitude: insertDestination.longitude ?? null
    };
    this.destinations.set(id, destination);
    return destination;
  }

  async getSwipeActionsBySession(sessionId: string): Promise<SwipeAction[]> {
    return Array.from(this.swipeActions.values()).filter(action => action.sessionId === sessionId);
  }

  async createSwipeAction(insertSwipeAction: InsertSwipeAction): Promise<SwipeAction> {
    const id = this.currentSwipeActionId++;
    const swipeAction: SwipeAction = { ...insertSwipeAction, id };
    this.swipeActions.set(id, swipeAction);
    return swipeAction;
  }

  async getLikedDestinations(sessionId: string): Promise<Destination[]> {
    const likedActions = Array.from(this.swipeActions.values())
      .filter(action => action.sessionId === sessionId && action.action === 'like');
    
    const likedDestinations: Destination[] = [];
    for (const action of likedActions) {
      const destination = this.destinations.get(action.destinationId);
      if (destination) {
        likedDestinations.push(destination);
      }
    }
    return likedDestinations;
  }
}

export const storage = new MemStorage();

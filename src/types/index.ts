export type Category = 'Museums' | 'Food' | 'Nature' | 'Landmarks' | 'Adventure' | 'Culture' | 'Beach';

export interface Place {
  id: string;
  title: string;
  city: string;
  country: string;
  category: Category | string;
  rating: number;
  reviewCount: number;
  description: string;
  longDescription: string;
  image: string;
  gallery: string[];
  openingHours: string;
  location: string;
  tags: string[];
  featured?: boolean;
}

export interface FavoriteRecord {
  id: string;
  userId: string;
  placeId: string;
  createdAt?: string;
}

export interface TripItem {
  placeId: string;
  day: number;
  note?: string;
}

export interface TripPlan {
  id: string;
  userId: string;
  name: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  items: TripItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  createdAt?: string;
}

export interface PlacesFilters {
  query: string;
  category: string;
  city: string;
  minRating: number;
  featuredOnly: boolean;
}

export interface AuthFormValues {
  displayName?: string;
  email: string;
  password: string;
}

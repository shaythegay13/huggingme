export interface MockProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  height: string;
  location: string;
  bio: string;
  photo: string;
  photos: string[];
  energyLevel: number;
  isVerified: boolean;
  isAvailable: boolean;
  languages: string[];
  skinType: string;
}

export const mockProfiles: MockProfile[] = [
  {
    id: "1",
    name: "Sarah",
    age: 28,
    gender: "Female",
    height: "5'6\"",
    location: "New York, NY",
    bio: "Yoga instructor who believes in the power of positive energy. I love meeting new people and sharing warmth through hugs!",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop",
    ],
    energyLevel: 8,
    isVerified: true,
    isAvailable: true,
    languages: ["English", "Spanish"],
    skinType: "Light",
  },
  {
    id: "2",
    name: "James",
    age: 32,
    gender: "Male",
    height: "6'1\"",
    location: "Los Angeles, CA",
    bio: "Surf coach and meditation enthusiast. My hugs come with ocean vibes and good energy.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
    ],
    energyLevel: 7,
    isVerified: true,
    isAvailable: false,
    languages: ["English"],
    skinType: "Tan",
  },
  {
    id: "3",
    name: "Emma",
    age: 25,
    gender: "Female",
    height: "5'4\"",
    location: "Chicago, IL",
    bio: "Elementary school teacher spreading joy one hug at a time. Kids say I give the best hugs!",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
    ],
    energyLevel: 9,
    isVerified: false,
    isAvailable: true,
    languages: ["English", "French"],
    skinType: "Fair",
  },
  {
    id: "4",
    name: "Michael",
    age: 30,
    gender: "Male",
    height: "5'10\"",
    location: "Miami, FL",
    bio: "Personal trainer and positivity advocate. A warm handshake or hug can change someone's whole day.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop",
    ],
    energyLevel: 6,
    isVerified: true,
    isAvailable: true,
    languages: ["English", "Portuguese"],
    skinType: "Medium",
  },
  {
    id: "5",
    name: "Luna",
    age: 27,
    gender: "Female",
    height: "5'7\"",
    location: "Seattle, WA",
    bio: "Sound healer and energy worker. My hugs are literally therapeutic — come feel the good vibes!",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop",
    ],
    energyLevel: 10,
    isVerified: true,
    isAvailable: true,
    languages: ["English", "Japanese"],
    skinType: "Fair",
  },
  {
    id: "6",
    name: "David",
    age: 35,
    gender: "Male",
    height: "6'0\"",
    location: "Austin, TX",
    bio: "Musician and community organizer. I believe in creating connections through music and warm embraces.",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop",
    ],
    energyLevel: 5,
    isVerified: false,
    isAvailable: false,
    languages: ["English", "German"],
    skinType: "Olive",
  },
];

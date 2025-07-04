export interface User {
  id: string;
  name: string;
  email: string;
  role: 'participant' | 'ngo';
  avatar?: string;
  bio?: string;
  location?: string;
  eventsJoined?: number;
  eventsOrganized?: number;
  totalWasteCollected?: number;
  ecoScore?: number;
  certificates?: Certificate[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  organizer: User;
  participants: User[];
  maxParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  imageUrl?: string;
  requiredItems: string[];
  estimatedWaste?: number;
  actualWaste?: number;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface EcoTip {
  id: string;
  title: string;
  content: string;
  category: 'waste-reduction' | 'ocean-protection' | 'sustainable-living' | 'recycling' | 'energy-saving';
  difficulty: 'easy' | 'medium' | 'hard';
  impact: 'low' | 'medium' | 'high';
  icon: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  points: number;
}

export interface Certificate {
  id: string;
  eventId: string;
  eventTitle: string;
  participantId: string;
  participantName: string;
  organizerId: string;
  organizerName: string;
  dateIssued: string;
  wasteCollected?: number;
  certificateType: 'participation' | 'achievement' | 'leadership';
  verificationCode: string;
}
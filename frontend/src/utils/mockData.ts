import { User, Event, Certificate } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ocean Guardians NGO',
    email: 'contact@oceanguardians.org',
    role: 'ngo',
    bio: 'Dedicated to protecting marine ecosystems through community-driven beach cleanups',
    location: 'San Francisco, CA',
    eventsOrganized: 25,
    avatar: 'https://images.pexels.com/photos/7456339/pexels-photo-7456339.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Alex Chen',
    email: 'alex@example.com',
    role: 'participant',
    bio: 'Environmental enthusiast passionate about ocean conservation',
    location: 'San Francisco, CA',
    eventsJoined: 12,
    totalWasteCollected: 45.5,
    ecoScore: 850,
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
    certificates: [
      {
        id: '1',
        eventId: '1',
        eventTitle: 'Golden Gate Beach Cleanup',
        participantId: '2',
        participantName: 'Alex Chen',
        organizerId: '1',
        organizerName: 'Ocean Guardians NGO',
        dateIssued: '2024-11-25',
        wasteCollected: 15.5,
        certificateType: 'participation',
        verificationCode: 'CW-2024-GG-001'
      }
    ]
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    email: 'maria@example.com',
    role: 'participant',
    bio: 'Marine biology student committed to preserving our beaches',
    location: 'Monterey, CA',
    eventsJoined: 8,
    totalWasteCollected: 32.1,
    ecoScore: 720,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Golden Gate Beach Cleanup',
    description: 'Join us for a comprehensive beach cleanup at Golden Gate Park. We\'ll provide all necessary equipment and refreshments. Perfect for families and individuals looking to make a positive impact.',
    date: '2024-12-15',
    time: '09:00',
    location: 'Golden Gate Park Beach, San Francisco',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    organizer: mockUsers[0],
    participants: [mockUsers[1], mockUsers[2]],
    maxParticipants: 50,
    status: 'upcoming',
    imageUrl: 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800',
    requiredItems: ['Gloves', 'Reusable water bottle', 'Hat', 'Sunscreen'],
    estimatedWaste: 100,
    createdAt: '2024-11-20T10:00:00Z'
  },
  {
    id: '2',
    title: 'Monterey Bay Restoration',
    description: 'A special event focused on removing plastic waste from Monterey Bay. Marine biologists will be present to educate participants about local marine life.',
    date: '2024-12-22',
    time: '08:30',
    location: 'Monterey Bay, Monterey',
    coordinates: { lat: 36.6177, lng: -121.9166 },
    organizer: mockUsers[0],
    participants: [mockUsers[2]],
    maxParticipants: 30,
    status: 'upcoming',
    imageUrl: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=800',
    requiredItems: ['Gloves', 'Sturdy shoes', 'Reusable water bottle'],
    estimatedWaste: 75,
    createdAt: '2024-11-22T14:00:00Z'
  },
  {
    id: '3',
    title: 'Half Moon Bay Community Cleanup',
    description: 'Our monthly community cleanup at Half Moon Bay. Join local families and environmental advocates for a morning of beach restoration and community building.',
    date: '2024-11-25',
    time: '10:00',
    location: 'Half Moon Bay State Beach',
    coordinates: { lat: 37.4636, lng: -122.4286 },
    organizer: mockUsers[0],
    participants: [mockUsers[1], mockUsers[2]],
    maxParticipants: 40,
    status: 'completed',
    imageUrl: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
    requiredItems: ['Gloves', 'Reusable water bottle', 'Comfortable walking shoes'],
    estimatedWaste: 60,
    actualWaste: 78.5,
    createdAt: '2024-11-01T09:00:00Z'
  }
];
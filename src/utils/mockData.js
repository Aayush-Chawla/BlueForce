// Converted from mockData.ts (TypeScript) to mockData.js (JavaScript)
// All type annotations and imports removed

export const mockUsers = [
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
  },
  {
    id: '4',
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    role: 'participant',
    bio: 'Nature lover and regular beach cleanup volunteer.',
    location: 'Santa Cruz, CA',
    eventsJoined: 10,
    totalWasteCollected: 38.2,
    ecoScore: 690,
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'participant',
    bio: 'Aspiring environmental scientist.',
    location: 'Los Angeles, CA',
    eventsJoined: 7,
    totalWasteCollected: 25.7,
    ecoScore: 540,
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '6',
    name: 'Fatima Al-Farsi',
    email: 'fatima.alfarsi@example.com',
    role: 'participant',
    bio: 'Passionate about ocean life and sustainability.',
    location: 'San Diego, CA',
    eventsJoined: 15,
    totalWasteCollected: 51.3,
    ecoScore: 910,
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '7',
    name: 'Lucas Müller',
    email: 'lucas.mueller@example.com',
    role: 'participant',
    bio: 'Exchange student and eco-activist.',
    location: 'Palo Alto, CA',
    eventsJoined: 5,
    totalWasteCollected: 19.8,
    ecoScore: 410,
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '8',
    name: 'Sofia Rossi',
    email: 'sofia.rossi@example.com',
    role: 'participant',
    bio: 'Loves the ocean and helping the community.',
    location: 'Santa Monica, CA',
    eventsJoined: 9,
    totalWasteCollected: 29.4,
    ecoScore: 600,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '9',
    name: 'Chen Wei',
    email: 'chen.wei@example.com',
    role: 'participant',
    bio: 'Enjoys volunteering and making new friends.',
    location: 'Oakland, CA',
    eventsJoined: 6,
    totalWasteCollected: 22.0,
    ecoScore: 480,
    avatar: 'https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '10',
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    role: 'participant',
    bio: 'High school student and environmental club member.',
    location: 'Berkeley, CA',
    eventsJoined: 4,
    totalWasteCollected: 13.6,
    ecoScore: 320,
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const mockEvents = [
  {
    id: '1',
    title: 'Golden Gate Beach Cleanup',
    description: "Join us for a comprehensive beach cleanup at Golden Gate Park. We'll provide all necessary equipment and refreshments. Perfect for families and individuals looking to make a positive impact.",
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

export const mockImpactStories = [
  {
    id: 's1',
    user: {
      name: 'Alex Chen',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'San Francisco, CA'
    },
    image: 'https://images.pexels.com/photos/2611025/pexels-photo-2611025.jpeg?auto=compress&cs=tinysrgb&w=800',
    text: 'Today, our team collected over 50kg of waste at Ocean Beach! It was inspiring to see so many volunteers working together for a cleaner coast. #BeachCleanup',
    aiGenerated: false,
    date: '2024-06-01T10:00:00Z'
  },
  {
    id: 's2',
    user: {
      name: 'AI Storyteller',
      avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
      location: 'AI Generated'
    },
    image: 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=800',
    text: 'In just one morning, volunteers restored a stretch of coastline, removing harmful plastics and making the beach safe for wildlife again. Every small action adds up to a big impact! 🌊🐢',
    aiGenerated: true,
    date: '2024-06-02T09:30:00Z'
  },
  {
    id: 's3',
    user: {
      name: 'Priya Singh',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Santa Cruz, CA'
    },
    image: 'https://images.pexels.com/photos/244145/pexels-photo-244145.jpeg?auto=compress&cs=tinysrgb&w=800',
    text: 'Loved seeing families and kids join the cleanup today. We found some strange items, but left the beach sparkling! #CommunityImpact',
    aiGenerated: false,
    date: '2024-06-03T15:45:00Z'
  },
  {
    id: 's4',
    user: {
      name: 'AI Storyteller',
      avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
      location: 'AI Generated'
    },
    image: 'https://images.pexels.com/photos/325807/pexels-photo-325807.jpeg?auto=compress&cs=tinysrgb&w=800',
    text: 'A group of passionate volunteers braved the early morning chill to remove debris from the shoreline. Their efforts not only beautified the beach but also protected countless marine creatures. #EcoHeroes',
    aiGenerated: true,
    date: '2024-06-04T08:15:00Z'
  }
];

export const mockFeedbacks = [
  // Example feedback
  {
    eventId: '3',
    rating: 5,
    feedback: 'Great experience! The organizers were very supportive and the event was well managed.',
    createdAt: '2024-06-05T12:00:00Z'
  },
  {
    eventId: '3',
    rating: 4,
    feedback: 'Loved the teamwork and the impact we made. Would love more refreshments next time!',
    createdAt: '2024-06-05T13:00:00Z'
  }
]; 
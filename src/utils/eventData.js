export const events = [
  {
    id: 'e456',
    name: 'Juhu Beach Cleanup',
    location: 'Juhu Beach, Mumbai',
    date: '2025-07-28',
    wasteCollected: 45,
    volunteers: 32,
    xpDistributed: 1280,
    sponsor: 'Acme Corp',
  },
  {
    id: 'e789',
    name: 'Versova Drive',
    location: 'Versova Beach, Mumbai',
    date: '2025-08-01',
    wasteCollected: 64,
    volunteers: 50,
    xpDistributed: 2100,
    sponsor: 'GreenFuture Ltd',
  },
  {
    id: 'e101',
    name: 'Marine Lines Cleanup',
    location: 'Marine Lines, Mumbai',
    date: '2025-08-15',
    wasteCollected: 18,
    volunteers: 15,
    xpDistributed: 600,
    sponsor: 'Acme Corp',
  },
];

export function getBadge(event) {
  if (event.wasteCollected > 50) return { label: 'Gold', color: 'bg-yellow-400 text-yellow-900' };
  if (event.wasteCollected >= 25) return { label: 'Silver', color: 'bg-gray-300 text-gray-800' };
  return { label: 'Bronze', color: 'bg-amber-700 text-amber-100' };
}

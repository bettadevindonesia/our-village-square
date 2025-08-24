export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: "community" | "government" | "culture" | "sports";
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "high" | "medium" | "low";
  category: "general" | "emergency" | "maintenance" | "event";
}

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Village Council Meeting",
    date: "2024-09-15",
    time: "19:00",
    location: "Town Hall",
    description: "Monthly village council meeting to discuss community matters and upcoming projects.",
    category: "government"
  },
  {
    id: "2",
    title: "Annual Harvest Festival",
    date: "2024-09-22",
    time: "14:00",
    location: "Village Green",
    description: "Join us for our traditional harvest festival with local food, music, and crafts.",
    category: "culture"
  },
  {
    id: "3",
    title: "Community Garden Workshop",
    date: "2024-09-08",
    time: "10:00",
    location: "Community Garden",
    description: "Learn sustainable gardening techniques and help maintain our community spaces.",
    category: "community"
  },
  {
    id: "4",
    title: "Village Football Match",
    date: "2024-09-10",
    time: "15:00",
    location: "Sports Field",
    description: "Friendly match between local teams. All residents welcome to watch and cheer!",
    category: "sports"
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Water Main Maintenance",
    content: "Water supply will be temporarily interrupted on September 5th from 9:00 AM to 3:00 PM for essential maintenance work on Oak Street.",
    date: "2024-09-01",
    priority: "high",
    category: "maintenance"
  },
  {
    id: "2",
    title: "New Recycling Guidelines",
    content: "Starting October 1st, new recycling guidelines will be in effect. Please separate glass items from other recyclables. Collection schedule remains unchanged.",
    date: "2024-08-28",
    priority: "medium",
    category: "general"
  },
  {
    id: "3",
    title: "Village WiFi Upgrade Complete",
    content: "The village-wide WiFi network upgrade has been completed. Residents can now access faster internet speeds in all public areas.",
    date: "2024-08-25",
    priority: "low",
    category: "general"
  },
  {
    id: "4",
    title: "Emergency Contact Updates",
    content: "Please ensure your emergency contact information is up to date with the village office. This helps us reach you during important announcements.",
    date: "2024-08-20",
    priority: "medium",
    category: "emergency"
  }
];
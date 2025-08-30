import { Post, SuggestedUser, User } from "../types";

export const currentUser: User = {
  id: "1",
  name: "Edward Clark",
  username: "edward",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  wordCount: 23000,
  followers: 4000,
  following: 98,
};

export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Could this be the most significant Nato summit since the Cold War?",
    content: `As the world holds its breath to see what happens next after the US launched direct attacks on Iran's nuclear sites, US President Donald Trump is expected in the Netherlands on Tuesday for a Nato summit.

This will be Trump's first Nato meeting since being re-elected. In the past, he's made angry comments about alliance members freeloading off US security guarantees. European allies are desperate to prove him not to...`,
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=300&fit=crop",
    author: {
      id: "2",
      name: "Emily Maitlis",
      username: "maitlis",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      wordCount: 45000,
      followers: 125000,
      following: 234,
    },
    likes: 17000,
    replies: 26,
    bookmarks: 341,
    createdAt: new Date("2025-08-29T10:30:00Z"),
  },
  {
    id: "2",
    title: "The Future of Renewable Energy: A Deep Dive into Solar Innovation",
    content: `Solar technology has reached a turning point. Recent breakthroughs in perovskite solar cells promise efficiency rates that could revolutionize the industry.

The implications extend far beyond just energy production. We're looking at potential cost reductions of up to 40% within the next five years, making solar power accessible to developing nations worldwide.

This shift represents more than technological advancement—it's a fundamental change in how we think about energy independence and climate action.`,
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=300&fit=crop",
    author: {
      id: "3",
      name: "Sarah Chen",
      username: "sarahtech",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      wordCount: 28500,
      followers: 45000,
      following: 567,
    },
    likes: 8500,
    replies: 142,
    bookmarks: 1200,
    createdAt: new Date("2025-08-29T08:15:00Z"),
  },
  {
    id: "3",
    title: "Why Remote Work Culture is Reshaping Urban Planning",
    content: `The pandemic fundamentally altered how we think about workspace, but the ripple effects are just beginning to surface in urban development.

Cities are now grappling with empty office buildings, reduced public transport usage, and a complete reimagining of downtown commercial districts. Some municipalities are converting office spaces into residential units, while others are creating hybrid community spaces.

The most fascinating development is the emergence of "15-minute cities"—urban planning concepts where everything you need is within a 15-minute walk or bike ride.`,
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=300&fit=crop",
    author: {
      id: "4",
      name: "Marcus Rodriguez",
      username: "urbanfuture",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      wordCount: 67800,
      followers: 89000,
      following: 1200,
    },
    likes: 12300,
    replies: 89,
    bookmarks: 567,
    createdAt: new Date("2025-08-28T16:45:00Z"),
  },
];

export const suggestedUsers: SuggestedUser[] = [
  {
    id: "2",
    name: "Emily Maitlis",
    username: "maitlis",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    wordCount: 45000,
    followers: 125000,
    following: 234,
  },
  {
    id: "5",
    name: "Victoria Derbyshire",
    username: "vderb",
    avatar:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
    wordCount: 32800,
    followers: 78500,
    following: 156,
  },
  {
    id: "6",
    name: "Emmanuel Macron",
    username: "presidentmacron",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    wordCount: 89200,
    followers: 2400000,
    following: 89,
  },
  {
    id: "7",
    name: "Richard Osman",
    username: "tall",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    wordCount: 54300,
    followers: 186000,
    following: 432,
  },
  {
    id: "8",
    name: "King Charles III",
    username: "theking",
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face",
    wordCount: 12600,
    followers: 5600000,
    following: 23,
  },
];

export const todayWordCount = 123876;

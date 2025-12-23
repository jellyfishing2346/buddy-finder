// Buddy Finder - Seed Data for Interests and Sample Users/Posts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const interestCategories = [
  { name: 'Hobbies', slug: 'hobbies', category: 'HOBBIES', iconUrl: '', description: 'Fun and leisure activities.' },
  { name: 'Entertainment', slug: 'entertainment', category: 'ENTERTAINMENT', iconUrl: '', description: 'Movies, TV, and more.' },
  { name: 'Technology', slug: 'technology', category: 'TECHNOLOGY', iconUrl: '', description: 'Tech, gadgets, and innovation.' },
  { name: 'Sports', slug: 'sports', category: 'SPORTS', iconUrl: '', description: 'All things sports.' },
  { name: 'Lifestyle', slug: 'lifestyle', category: 'LIFESTYLE', iconUrl: '', description: 'Daily living and wellness.' },
  { name: 'Learning', slug: 'learning', category: 'LEARNING', iconUrl: '', description: 'Education and self-improvement.' },
  { name: 'Creative', slug: 'creative', category: 'CREATIVE', iconUrl: '', description: 'Art, design, and creativity.' },
  { name: 'Gaming', slug: 'gaming', category: 'GAMING', iconUrl: '', description: 'Video and board games.' },
  { name: 'Food', slug: 'food', category: 'FOOD', iconUrl: '', description: 'Cooking and cuisine.' },
  { name: 'Travel', slug: 'travel', category: 'TRAVEL', iconUrl: '', description: 'Exploring the world.' },
  { name: 'Fitness', slug: 'fitness', category: 'FITNESS', iconUrl: '', description: 'Exercise and health.' },
  { name: 'Music', slug: 'music', category: 'MUSIC', iconUrl: '', description: 'All about music.' },
  { name: 'Art', slug: 'art', category: 'ART', iconUrl: '', description: 'Visual arts.' },
  { name: 'Business', slug: 'business', category: 'BUSINESS', iconUrl: '', description: 'Entrepreneurship and work.' },
  { name: 'Science', slug: 'science', category: 'SCIENCE', iconUrl: '', description: 'STEM and discovery.' },
  { name: 'Other', slug: 'other', category: 'OTHER', iconUrl: '', description: 'Everything else.' },
];

const subInterests = [
  // 100+ sub-interests, each with a parent category, slug, and relatedInterests (array of slugs)
  { name: 'Photography', slug: 'photography', category: 'CREATIVE', related: ['art', 'travel', 'technology'] },
  { name: 'Cooking', slug: 'cooking', category: 'FOOD', related: ['food', 'lifestyle', 'health'] },
  { name: 'Soccer', slug: 'soccer', category: 'SPORTS', related: ['fitness', 'travel', 'gaming'] },
  { name: 'Programming', slug: 'programming', category: 'TECHNOLOGY', related: ['technology', 'science', 'gaming'] },
  { name: 'Guitar', slug: 'guitar', category: 'MUSIC', related: ['music', 'art', 'creative'] },
  // ... (add 100+ sub-interests for full taxonomy)
];

async function main() {
  // Create main categories
  for (const cat of interestCategories) {
    await prisma.interest.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        category: cat.category,
        description: cat.description,
        iconUrl: cat.iconUrl,
        relatedInterests: [],
      },
    });
  }
  // Create sub-interests
  for (const sub of subInterests) {
    await prisma.interest.upsert({
      where: { name: sub.name },
      update: {},
      create: {
        name: sub.name,
        category: sub.category,
        description: '',
        iconUrl: '',
        relatedInterests: sub.related,
      },
    });
  }
  // Sample users, posts, connections, etc. can be added here
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

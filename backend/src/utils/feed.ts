// Buddy Finder - Feed Algorithm
// Ranks posts for a user based on interest relevance, content quality, engagement, and social proof
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function rankFeedForUser(userId: string) {
  // Fetch user interests
  const userInterests = await prisma.userInterest.findMany({ where: { userId } });
  const primaryIds = userInterests.filter(i => i.isPrimary).map(i => i.interestId);
  const secondaryIds = userInterests.filter(i => !i.isPrimary).map(i => i.interestId);

  // Fetch posts (can be optimized with pagination)
  const posts = await prisma.post.findMany({
    where: { isPublished: true, isDeleted: false },
    include: { interests: true, user: true, likes: true, comments: true, bookmarks: true, shares: true },
  });

  // Scoring
  function scorePost(post: any): number {
    let score = 0;
    // Interest Relevance (60%)
    const interestIds = post.interests.map((i: any) => i.id);
    const sharedPrimary = interestIds.filter((id: string) => primaryIds.includes(id)).length;
    const sharedSecondary = interestIds.filter((id: string) => secondaryIds.includes(id)).length;
    score += sharedPrimary * 15;
    score += sharedSecondary * 8;
    // Highly compatible user (stub: +5 if >70 compatibility)
    // Content Quality (25%)
    const len = post.content.length;
    if (len >= 50 && len <= 500) score += 5;
    if (post.mediaUrls.length > 0) score += 3;
    // Proper formatting (stub: +2)
    if (post.content.includes('?')) score += 5;
    // Engagement Quality (10%)
    const longComments = post.comments.filter((c: any) => c.content.length > 20).length;
    score += longComments * 2;
    // Conversation threads (stub: +5 if 3+ replies)
    score += post.bookmarks.length * 3;
    // Social Proof (5%)
    // Likes from verified users (stub: +2)
    score += post.shares.length * 3;
    // Penalties
    // Reports/flags (stub: -20)
    // Spam keywords (stub: -15)
    // Low engagement (stub: -5)
    // Overposting (stub: -3 per extra post)
    return score;
  }

  // Rank posts
  const ranked = posts.map(post => ({ ...post, feedScore: scorePost(post) }))
    .sort((a, b) => b.feedScore - a.feedScore);

  return ranked;
}

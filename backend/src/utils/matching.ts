// Buddy Finder - Matching Algorithm
// Calculates compatibility score between two users based on shared interests, connections, and activity
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function calculateCompatibility(userAId: string, userBId: string): Promise<number> {
  // Fetch user interests
  const [userAInterests, userBInterests] = await Promise.all([
    prisma.userInterest.findMany({ where: { userId: userAId } }),
    prisma.userInterest.findMany({ where: { userId: userBId } }),
  ]);

  // Map interests
  // Assuming weight >= 5 is primary, < 5 is secondary (adjust threshold as needed)
  const aPrimary = new Set(userAInterests.filter(i => i.weight >= 5).map(i => i.interestId));
  const aSecondary = new Set(userAInterests.filter(i => i.weight < 5).map(i => i.interestId));
  const bPrimary = new Set(userBInterests.filter(i => i.weight >= 5).map(i => i.interestId));
  const bSecondary = new Set(userBInterests.filter(i => i.weight < 5).map(i => i.interestId));

  // Shared interests
  let score = 0;
  for (const id of aPrimary) {
    if (bPrimary.has(id)) score += 10;
    else if (bSecondary.has(id)) score += 5;
  }
  for (const id of aSecondary) {
    if (bPrimary.has(id)) score += 5;
    else if (bSecondary.has(id)) score += 3;
  }

  // Related interests
  const allInterestIds = Array.from(new Set([...aPrimary, ...aSecondary, ...bPrimary, ...bSecondary]));
  const relatedMap: Record<string, string[]> = {};
  const allInterests = await prisma.interest.findMany({
    where: { id: { in: allInterestIds } },
    select: { id: true, relatedInterests: true }
  });
  allInterests.forEach(i => { relatedMap[i.id] = i.relatedInterests; });
  for (const idA of aPrimary) {
    for (const idB of bPrimary) {
      if (relatedMap[idA]?.includes(idB)) score += 3;
    }
  }

  // Similar activity patterns (stub: can be expanded)
  // e.g., posting frequency, time of day, etc.
  // score += 2 if similar

  // Geographic proximity (optional, stub)
  // score += 2 if close

  // Mutual connections
  const mutualConnections = await prisma.connections.count({
    where: {
      status: 'ACCEPTED',
      requesterId: userAId,
      addresseeId: userBId,
    },
  });
  score += mutualConnections * 1;

  return Math.min(score, 100);
}

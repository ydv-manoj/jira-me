import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch issues categorized by status
    const [openIssues, inProgressIssues, closedIssues] = await Promise.all([
      prisma.issue.findMany({ where: { Status: 'OPEN' } }),
      prisma.issue.findMany({ where: { Status: 'IN_PROGRESS' } }),
      prisma.issue.findMany({ where: { Status: 'CLOSED' } })
    ]);
    
    res.status(200).json({ openIssues, inProgressIssues, closedIssues });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching issues' });
  }
}

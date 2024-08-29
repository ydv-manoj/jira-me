import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch issues categorized by status
    const [openIssues, inProgressIssues, closedIssues] = await Promise.all([
      prisma.issue.findMany({ where: { Status: 'OPEN' } }),
      prisma.issue.findMany({ where: { Status: 'IN_PROGRESS' } }),
      prisma.issue.findMany({ where: { Status: 'CLOSED' } })
    ]);

    return NextResponse.json({ openIssues, inProgressIssues, closedIssues });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching issues' }, { status: 500 });
  }
}

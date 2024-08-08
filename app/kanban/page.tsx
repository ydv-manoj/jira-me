import { Suspense } from 'react';
import { PrismaClient } from '@prisma/client';
import { KanbanBoard } from '../shadcncomponents/KanbanBoard';

const prisma = new PrismaClient();

export default async function KanbanPage() {
  const issues = await prisma.issue.findMany({
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KanbanBoard issues={issues} />
    </Suspense>
  );
}
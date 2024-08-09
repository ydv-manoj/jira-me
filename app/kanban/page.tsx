import { Suspense } from 'react';
import { PrismaClient } from '@prisma/client';
import { KanbanBoard } from '../shadcncomponents/KanbanBoard';
import AvatarGroup from '../components/AvatarGroup';
import prisma from '@/prisma/client';

export default async function KanbanPage() {
  const issues = await prisma.issue.findMany({
    include: {
      assignedToUser: true,
    },
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AvatarGroup/>
      <KanbanBoard issues={issues} />
    </Suspense>
  );
}
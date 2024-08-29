// TaskCard.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { GripVertical } from 'lucide-react';
import { Badge } from './ui/badge';
import type { ColumnId } from './KanbanBoard';
import Link from 'next/link';
import { User } from '@prisma/client';
import { Avatar } from '@radix-ui/themes';

export interface Task {
  id: number;
  columnId: ColumnId;
  content: string;
  description: string;
  assignedToUserId: string | null;
  assignedToUser:User |null
}
export interface TaskDragData {
  type: 'Task';
  task: Task;
}

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    attributes: {
      roleDescription: 'Task',
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`
        ${isDragging ? 'ring-2 opacity-30' : isOverlay ? 'ring-2 ring-primary' : ''}
        transition-all duration-300 ease-in-out
      `}
    >
      <CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative">
        <Button
          variant={'ghost'}
          {...attributes}
          {...listeners}
          className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab transition-colors duration-200"
        >
          <span className="sr-only">Move task</span>
          <GripVertical />
        </Button>
        <Badge variant={'outline'} className="ml-auto font-semibold">
          Task
        </Badge>
      </CardHeader>
      <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap flex justify-between items-center">
        <Link href={`/issues/${task.id}`}>{task.content}</Link>
        {task.assignedToUser && (
                    <Avatar
                      src={task.assignedToUser.image!}
                      fallback="?"
                      size="2"
                      radius="full"
                    />
                  )}
      </CardContent>
    </Card>
  );
}
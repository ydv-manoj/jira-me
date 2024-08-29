import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskCard } from './TaskCard';
import { cva } from 'class-variance-authority';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { GripVertical } from 'lucide-react';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

export interface Column {
  id: string;
  title: string;
}

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
}

export interface ColumnDragData {
  type: 'Column';
  column: Column;
}


export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    'h-[77vh] max-h-[77vh] w-[350px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center',
    {
      variants: {
        dragging: {
          default: 'border-2 border-transparent',
          over: 'ring-2 opacity-30',
          overlay: 'ring-2 ring-primary',
        },
      },
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined,
      })}
    >
      <CardHeader className="p-4 font-semibold border-b-2 text-left flex flex-row space-between items-center">
        <Button
          variant={'ghost'}
          {...attributes}
          {...listeners}
          className="p-1 text-primary/50 -ml-2 h-auto cursor-grab relative"
        >
          <span className="sr-only">{`Move column: ${column.title}`}</span>
          <GripVertical />
        </Button>
        <span className="ml-auto">{column.title}</span>
      </CardHeader>
      <ScrollArea>
        <CardContent className="flex flex-grow flex-col gap-2 p-2">
          <SortableContext items={tasks.map(task => task.id)}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  return (
    <ScrollArea className="px-2 md:px-0 flex lg:justify-center pb-4 h-[79vh]">
      <div className="flex gap-4 items-center flex-row justify-center">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

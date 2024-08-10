"use client"
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Announcements,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Issue, User } from "@prisma/client";
import { Card } from "@radix-ui/themes";
import axios from "axios";
import type { Column } from "./BoardColumn";
import { BoardColumn, BoardContainer } from "./BoardColumn";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";
import { TaskCard } from "./TaskCard";
import { hasDraggableData } from "./utils";

export type IssueWithUser = Issue & {
  assignedToUser: User | null;
};

type KanbanBoardProps = {
  issues:IssueWithUser[]
};

const defaultCols: Column[] = [
  {
    id: "open" as ColumnId,
    title: "Open",
  },
  {
    id: "in_progress" as ColumnId,
    title: "In Progress",
  },
  {
    id: "closed" as ColumnId,
    title: "Closed",
  },
];

export type ColumnId = (typeof defaultCols)[number]["id"];

export type Task = {
  id: number;
  columnId: ColumnId;
  content: string;
  description: string;
  assignedToUserId: string | null;
  assignedToUser: User | null
};

interface ColumnData {
  type: "Column";
  column: Column;
}

interface TaskData {
  type: "Task";
  task: Task;
}

type DragData = ColumnData | TaskData;

export function KanbanBoard({ issues }: KanbanBoardProps) {
  console.log(issues);
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const pickedUpTaskColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>(
    issues.map((issue) => ({
      id: issue.id,
      columnId: issue.Status.toLowerCase() as ColumnId,
      content: issue.title,
      description: issue.description,
      assignedToUserId: issue.assignedToUserId,
      assignedToUser: issue.assignedToUser as User || null
    }))
  );

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

    const tasksByColumn = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.id] = tasks.filter((task) => task.columnId === column.id);
      return acc;
    }, {} as Record<ColumnId, Task[]>);
  }, [tasks, columns]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
    const tasksInColumn = tasks.filter((task) => task.columnId === columnId);
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
    const column = columns.find((col) => col.id === columnId);
    return {
      tasksInColumn,
      taskPosition,
      column,
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === "Column") {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } else if (active.data.current?.type === "Task") {
        pickedUpTaskColumn.current = active.data.current.task.columnId;
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current!
        );
        return `Picked up Task ${
          active.data.current.task.content
        } at position: ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        );
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          return `Task ${
            active.data.current.task.content
          } was moved over column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was moved over position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        );
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          return `Task was dropped into column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was dropped into position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
      pickedUpTaskColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  // State to manage whether the component is mounted
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Update state to indicate that the component is mounted
    setIsClient(true);
  }, []);

  return (
    <Card>
          <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <BoardContainer>
        <SortableContext items={columns.map((col) => col.id)}>
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              tasks={tasksByColumn[column.id]}
            />
          ))}
        </SortableContext>
      </BoardContainer>
      <DragOverlay>
        {activeColumn && (
          <BoardColumn
            column={activeColumn}
            tasks={tasksByColumn[activeColumn.id]}
            isOverlay
          />
        )}
        {activeTask && <TaskCard task={activeTask} isOverlay />}
      </DragOverlay>
    </DndContext>
    </Card>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current as DragData;
    if (data.type === "Column") {
      setActiveColumn(data.column);
      return;
    }
  
    if (data.type === "Task") {
      setActiveTask(data.task);
      return;
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current as DragData;
    const overData = over.data.current as DragData;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === "Column";
    const isActiveATask = activeData?.type === "Task";
    const isOverAColumn = overData?.type === "Column";

    if (isActiveAColumn) {
      // Handle column reordering (remains the same)
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
        const overColumnIndex = columns.findIndex((col) => col.id === overId);
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
    }

    if (isActiveATask) {
      const newColumnId = isOverAColumn 
        ? overId as ColumnId 
        : (overData as TaskData).task.columnId;

      // Update the task status via the API
      try {
        const response = await axios.put(`/api/UpdateStatus/${activeId}`, {
          status: newColumnId.toUpperCase()
        });

        if (response.status === 200) {
          // Update the local state
          setTasks((tasks) =>
            tasks.map((task) =>
              task.id === activeId
                ? { ...task, columnId: newColumnId }
                : task
            )
          );
        } else {
          console.error("Failed to update task status");
        }
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  }
  
  
  

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
  
    const activeId = active.id;
    const overId = over.id;
  
    if (activeId === overId) return;
  
    if (!hasDraggableData(active) || !hasDraggableData(over)) return;
  
    const activeData = active.data.current as DragData;
    const overData = over.data.current as DragData;
  
    const isActiveATask = activeData.type === "Task";
    const isOverATask = overData.type === "Task";
  
    if (!isActiveATask) return;
  
    // I'm dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];
  
        if (activeTask && overTask && activeTask.columnId !== overTask.columnId) {
          return arrayMove(
            tasks.map((task) =>
              task.id === activeId
                ? { ...task, columnId: overTask.columnId as ColumnId }
                : task
            ),
            activeIndex,
            overIndex - 1
          );
        }
  
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
  
    const isOverAColumn = overData.type === "Column";
  
    // I'm dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === activeId
            ? { ...task, columnId: overId as ColumnId }
            : task
        )
      );
    }
  }
}

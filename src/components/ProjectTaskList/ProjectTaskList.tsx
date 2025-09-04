"use client";

import { useCallback, useState } from "react";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Project {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  order: number;
}

interface Task {
  id: string;
  title: string;
  projectId: string;
  status: string;
  order: number;
  createdAt: string;
}

interface ProjectTaskManagerProps {
  projects: Project[];
  tasks: Task[];
}

interface SortableProjectProps {
  project: Project;
  tasks: Task[];
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onTaskStatusChange: (taskId: string, status: "active" | "done") => void;
}

interface SortableTaskProps {
  task: Task;
  onStatusChange: (taskId: string, status: "active" | "done") => void;
}

function SortableTask({ task, onStatusChange }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 ml-6 border border-border rounded-md hover:bg-accent/20 transition-colors",
        isDragging && "opacity-50"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-foreground/60 hover:text-foreground/90"
        aria-label="Drag handle"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <Checkbox
        className="cursor-pointer text-foreground/60 hover:text-foreground/90"
        checked={task.status === "done"}
        onCheckedChange={(checked) =>
          onStatusChange(task.id, checked ? "done" : "active")
        }
      />
      <span
        className={cn(
          "flex-1 text-sm text-foreground",
          task.status === "done" && "line-through text-foreground/60"
        )}
      >
        {task.title}
      </span>
    </div>
  );
}

function SortableProject({
  project,
  tasks,
  isExpanded,
  onToggleExpanded,
  onTaskStatusChange,
}: SortableProjectProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const projectTasks = tasks
    .filter((task) => task.projectId === project.id)
    .sort((a, b) => a.order - b.order);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border border-border rounded-lg bg-background m-6 transition-all duration-200",
        isDragging && "opacity-70 shadow-md"
      )}
    >
      <div className="flex items-center gap-3 p-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-foreground/60 hover:text-foreground"
          aria-label="Drag handle"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <button
          onClick={onToggleExpanded}
          aria-expanded={isExpanded}
          aria-controls={`project-${project.id}-tasks`}
          className="flex items-center gap-2 flex-1 text-left group"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-foreground/70" />
          ) : (
            <ChevronRight className="h-4 w-4 text-foreground/70" />
          )}
          <h3 className="font-medium text-foreground group-hover:text-accent-2 transition-colors">
            {project.name}
          </h3>
          <span className="text-sm text-foreground/60 ml-auto">
            {projectTasks.length} task{projectTasks.length !== 1 ? "s" : ""}
          </span>
        </button>
      </div>

      {isExpanded && projectTasks.length > 0 && (
        <div className="px-4 pb-4 space-y-2" id={`project-${project.id}-tasks`}>
          <SortableContext
            items={projectTasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {projectTasks.map((task) => (
              <SortableTask
                key={task.id}
                task={task}
                onStatusChange={onTaskStatusChange}
              />
            ))}
          </SortableContext>
        </div>
      )}

      {isExpanded && projectTasks.length === 0 && (
        <div className="px-4 pb-4">
          <p className="text-sm text-foreground/50 italic">No tasks yet</p>
        </div>
      )}
    </div>
  );
}

export function ProjectTaskList({ projects, tasks }: ProjectTaskManagerProps) {
  const [projectsData, setProjectsData] = useState(
    [...projects].sort((a, b) => a.order - b.order)
  );
  const [tasksData, setTasksData] = useState(tasks);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set()
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isProject = projectsData.some((p) => p.id === activeId);

    if (isProject) {
      setProjectsData((projects) => {
        const oldIndex = projects.findIndex((p) => p.id === activeId);
        const newIndex = projects.findIndex((p) => p.id === overId);

        const newProjects = arrayMove(projects, oldIndex, newIndex);
        return newProjects.map((project, index) => ({
          ...project,
          order: index,
        }));
      });
    } else {
      const activeTask = tasksData.find((t) => t.id === activeId);
      const overTask = tasksData.find((t) => t.id === overId);

      if (!activeTask || !overTask) return;

      if (activeTask.projectId === overTask.projectId) {
        setTasksData((tasks) => {
          const projectTasks = tasks.filter(
            (t) => t.projectId === activeTask.projectId
          );
          const otherTasks = tasks.filter(
            (t) => t.projectId !== activeTask.projectId
          );

          const oldIndex = projectTasks.findIndex((t) => t.id === activeId);
          const newIndex = projectTasks.findIndex((t) => t.id === overId);

          const reorderedTasks = arrayMove(projectTasks, oldIndex, newIndex);
          const updatedProjectTasks = reorderedTasks.map((task, index) => ({
            ...task,
            order: index,
          }));

          return [...otherTasks, ...updatedProjectTasks];
        });
      }
    }
  };

  const handleTaskStatusChange = useCallback(
    (taskId: string, status: "active" | "done") => {
      setTasksData((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, status } : task))
      );
    },
    []
  );

  const toggleProjectExpanded = useCallback((projectId: string) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => {
        setActiveId(active.id as string);
      }}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-3 bg-panel-bg border border-border rounded-md">
        <SortableContext
          items={projectsData.map((project) => project.id)}
          strategy={verticalListSortingStrategy}
        >
          {projectsData.map((project) => (
            <SortableProject
              key={project.id}
              project={project}
              tasks={tasksData}
              isExpanded={expandedProjects.has(project.id)}
              onToggleExpanded={() => toggleProjectExpanded(project.id)}
              onTaskStatusChange={handleTaskStatusChange}
            />
          ))}
        </SortableContext>

        {projectsData.length === 0 && (
          <p className="text-center text-foreground/60 text-sm py-8">
            No projects yet. Create one to get started.
          </p>
        )}
      </div>
      <DragOverlay>
        {activeId ? (
          // Show a clean version of the dragged item
          projectsData.some((p) => p.id === activeId) ? (
            <div className="border rounded-lg bg-card shadow-lg p-4 opacity-90">
              {projectsData.find((p) => p.id === activeId)?.name}
            </div>
          ) : (
            <div className="p-3 ml-6 border rounded-md bg-card shadow-lg">
              {tasksData.find((t) => t.id === activeId)?.title}
            </div>
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

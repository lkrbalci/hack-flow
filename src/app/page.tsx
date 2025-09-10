"use client";

import { DynamicSheet } from "@/components/DynamicSheet/DynamicSheet";
import { useSheetManager } from "@/hooks/useSheetManager";
import { TaskForm } from "@/components/forms/TaskForm";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { Button } from "@/components/ui/button";
import { TimeTrackerForm } from "@/components/forms/TimeTrackerForm";
import { TimeTrackerDisplay } from "@/components/TimeTrackerDisplay/TimeTrackerDisplay";
import { ProgressTrackerDisplay } from "@/components/ProgressTrackerDisplay/ProgressTrackerDisplay";
import { ProjectTaskList } from "@/components/ProjectTaskList/ProjectTaskList";
import { AuthButtonGuard } from "@/components/AuthButtonGuard/AuthButtonGuard";
import { useLogout } from "@/hooks/useAuthMutations";

import { useProjectsQuery } from "@/hooks/project/projectQueries";
import { useTasksQuery } from "@/hooks/task/taskQueries";

export default function Home() {
  const { sheet, openSheet, closeSheet } = useSheetManager();
  const { mutate: logout, isPending } = useLogout();

  const projectsQuery = useProjectsQuery();
  const tasksQuery = useTasksQuery();

  const projects = projectsQuery.data || [];
  const tasks = tasksQuery.data || [];

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Time Progress Tracker
          </h1>
          <p className="text-foreground/70 text-lg">
            Set your time period and watch the progress unfold
          </p>
        </div>

        <TimeTrackerDisplay />
        <div className="pt-8"></div>
        <ProgressTrackerDisplay />
        <div className="pt-8"></div>

        <ProjectTaskList projects={projects} tasks={tasks} />
      </div>

      <DynamicSheet
        open={sheet.open}
        onOpenChange={closeSheet}
        title={
          sheet.type === "task"
            ? "Add New Task"
            : sheet.type === "project"
            ? "Add New Project"
            : sheet.type === "time-tracker"
            ? "Configure Time Tracker"
            : ""
        }
      >
        {sheet.type === "task" && (
          <TaskForm onSubmit={closeSheet} onCancel={closeSheet} />
        )}
        {sheet.type === "project" && (
          <ProjectForm onSubmit={closeSheet} onCancel={closeSheet} />
        )}
        {sheet.type === "time-tracker" && (
          <TimeTrackerForm onSubmit={closeSheet} onCancel={closeSheet} />
        )}
      </DynamicSheet>

      <div className="fixed bottom-6 right-6 flex gap-2">
        <Button onClick={() => openSheet("task")}>Add Task</Button>
        <Button onClick={() => openSheet("project")}>Add Project</Button>
        <AuthButtonGuard>
          <Button onClick={() => openSheet("time-tracker")}>
            Configure Tracker
          </Button>
        </AuthButtonGuard>
        <Button onClick={() => logout()} disabled={isPending}>
          Logout
        </Button>
      </div>
    </main>
  );
}

"use client";

import { DynamicSheet } from "@/components/DynamicSheet/DynamicSheet";
import { SheetData, SheetType, useSheetManager } from "@/hooks/useSheetManager";
import { TaskForm } from "@/components/forms/TaskForm";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { TimeTrackerForm } from "@/components/forms/TimeTrackerForm";
import { TimeTrackerDisplay } from "@/components/TimeTrackerDisplay/TimeTrackerDisplay";
import { ProgressTrackerDisplay } from "@/components/ProgressTrackerDisplay/ProgressTrackerDisplay";
import { ProjectTaskList } from "@/components/ProjectTaskList/ProjectTaskList";

import { useProjectsQuery } from "@/hooks/project/projectQueries";
import { useTasksQuery } from "@/hooks/task/taskQueries";
import { useUser } from "@/hooks/useUser";
import { LoginRequiredBanner } from "@/components/LoginRequiredBanner/LoginRequiredBanner";
import { useLogout } from "@/hooks/useAuthMutations";

export default function Home() {
  const { sheet, openSheet, closeSheet } = useSheetManager();

  const { user } = useUser();
  const userId = user?.$id;

  const projectsQuery = useProjectsQuery({
    enabled: !!user,
  });
  const tasksQuery = useTasksQuery({
    enabled: !!user,
  });

  const { mutate: logout } = useLogout();

  const projects = projectsQuery.data || [];
  const tasks = tasksQuery.data || [];

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Hack-Flow Time Progress Tracker
          </h1>
          <p className="text-foreground/70 text-lg">
            Set your time period and watch the progress unfold
          </p>
        </div>
        {!user && <LoginRequiredBanner />}
        <div className="pt-8"></div>
        <TimeTrackerDisplay
          userId={userId}
          openSheet={(type: SheetType) => openSheet(type)}
        />
        <div className="pt-8"></div>
        <ProgressTrackerDisplay tasks={tasks} />
        <div className="pt-8"></div>

        <ProjectTaskList
          projects={projects}
          tasks={tasks}
          openSheet={(type: SheetType, data?: SheetData) =>
            openSheet(type, data)
          }
        />
      </div>

      {userId && (
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
            <TaskForm
              closeSheet={closeSheet}
              projectId={sheet.data?.projectId}
              userId={userId}
              tasks={tasks}
            />
          )}
          {sheet.type === "project" && (
            <ProjectForm
              projects={projects}
              userId={userId}
              closeSheet={closeSheet}
            />
          )}
          {sheet.type === "time-tracker" && (
            <TimeTrackerForm userId={userId} closeSheet={closeSheet} />
          )}
        </DynamicSheet>
      )}

      <button onClick={() => logout()}>LogOut</button>
    </main>
  );
}

"use client";

import { DynamicSheet } from "@/components/DynamicSheet/DynamicSheet";
import { TimeTracker } from "@/components/TimeTracker/TimeTracker";
import { useSheetManager } from "@/hooks/useSheetManager";
import { TaskForm } from "@/components/forms/TaskForm";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { Button } from "@/components/ui/button";
import { TimeTrackerForm } from "@/components/forms/TimeTrackerForm";

export default function Home() {
  const { sheet, openSheet, closeSheet } = useSheetManager();

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
        <TimeTracker />
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
      <Button onClick={() => openSheet("task")}>Open Sheet</Button>
      <Button onClick={() => openSheet("project")}>Open Sheet</Button>
      <Button onClick={() => openSheet("time-tracker")}>Open Sheet</Button>
    </main>
  );
}

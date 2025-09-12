"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/types/task";

export function ProgressTrackerDisplay({ tasks }: { tasks: Task[] }) {
  const totalCount = tasks.length;
  const completedCount = tasks.filter((task) => task.status === "done").length;

  const totalEffort = tasks.reduce((sum, task) => sum + task.effortEstimate, 0);
  const completedEffort = tasks
    .filter((task) => task.status === "done")
    .reduce((sum, task) => sum + task.effortEstimate, 0);

  const progressPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isComplete = completedCount === totalCount && totalCount > 0;

  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    let start = animatedPercentage;
    const end = progressPercentage;

    if (start === end) {
      setAnimatedPercentage(end);
      return;
    }

    const duration = 500; // ms
    const difference = Math.abs(end - start);
    const stepTime =
      difference > 0 ? Math.abs(Math.floor(duration / difference)) : 16;

    const safeStepTime = Math.max(16, Math.min(stepTime, 100));

    const timer = setInterval(() => {
      if (start < end) {
        start += 1;
        setAnimatedPercentage(start);
      } else if (start > end) {
        start -= 1;
        setAnimatedPercentage(start);
      } else {
        clearInterval(timer);
      }
    }, safeStepTime);

    return () => clearInterval(timer);
  }, [progressPercentage, animatedPercentage]);

  return (
    <Card
      className="bg-panel-bg border-border"
      aria-label="Effort Progress Tracker"
    >
      <CardHeader>
        <CardTitle className="text-foreground text-center">
          {isComplete ? "🎉 All Tasks Done!" : "📊 Effort Progress"}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <p className="text-foreground/70 text-sm">
            {completedCount} of {totalCount} tasks completed
          </p>
        </div>

        <div className="text-center mb-8">
          <div className="text-6xl sm:text-7xl font-bold font-mono text-accent-2">
            {animatedPercentage}%
          </div>
          <div className="text-sm text-foreground/60 mt-1">
            Based on task completion
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm text-foreground/70">
            <span>Progress</span>
            <span>{animatedPercentage}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={animatedPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            className="w-full bg-background rounded-full h-8 border border-border overflow-hidden"
          >
            <div
              className="h-full bg-gradient-to-r from-accent-3 via-accent-2 to-accent-1 rounded-full flex items-center justify-end pr-3 transition-all duration-300"
              style={{ width: `${animatedPercentage}%` }}
            >
              {animatedPercentage >= 8 && (
                <span className="text-foreground font-medium text-sm drop-shadow-sm">
                  {animatedPercentage}%
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-foreground/60 space-y-1">
          <div>
            Effort: {completedEffort.toFixed(1)} / {totalEffort.toFixed(1)}
          </div>
          <div>
            <span className="inline-block w-3 h-3 bg-accent-3 rounded-sm mr-1"></span>
            Done
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchEffortProgress, EffortSummary } from "./effortProgressMockApi";

export function ProgressTrackerDisplay() {
  const {
    data: summary,
    isLoading,
    error,
  } = useQuery<EffortSummary>({
    queryKey: ["effortProgress"],
    queryFn: fetchEffortProgress,
    staleTime: 1000 * 60 * 5, // Cache 5 mins
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  // Animate percentage number
  useEffect(() => {
    if (summary) {
      const target = Math.round(summary.percentage);
      const duration = 1500;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;

      const timer = setInterval(() => {
        frame++;
        const easeOut = 1 - Math.pow(1 - frame / totalFrames, 3);
        const current = Math.round(easeOut * target);
        setAnimatedPercentage(current);

        if (frame === totalFrames) clearInterval(timer);
      }, frameDuration);

      return () => clearInterval(timer);
    }
  }, [summary]);

  if (isLoading) {
    return (
      <Card className="bg-panel-bg border-border">
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-foreground/70">Calculating progress...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !summary) {
    return (
      <Card className="bg-panel-bg border-border">
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-red-500">Failed to load progress.</p>
        </CardContent>
      </Card>
    );
  }

  const isComplete = summary.percentage >= 100;

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
            {summary.completedCount} of {summary.totalCount} tasks completed
          </p>
        </div>

        {/* Animated Percentage */}
        <div className="text-center mb-8">
          <div className="text-6xl sm:text-7xl font-bold font-mono text-accent-2">
            {animatedPercentage}%
          </div>
          <div className="text-sm text-foreground/60 mt-1">
            Based on effort estimation
          </div>
        </div>

        {/* Progress Bar */}
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

        {/* Effort Breakdown */}
        <div className="mt-6 text-center text-xs text-foreground/60 space-y-1">
          <div>
            Effort: {summary.completedEffort.toFixed(1)} /{" "}
            {summary.totalEffort.toFixed(1)}
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

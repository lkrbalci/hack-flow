"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  fetchTimeTrackerConfig,
  TimeTrackerConfig,
} from "./timeTrackerMockApi";
import { DateTime } from "luxon";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function TimeTrackerDisplay() {
  const {
    data: config,
    isLoading,
    error,
  } = useQuery<TimeTrackerConfig>({
    queryKey: ["timeTrackerConfig"],
    queryFn: fetchTimeTrackerConfig,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [progress, setProgress] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  const calculateTimeRemaining = useCallback(() => {
    if (!config) return;

    const { startDate, startTime, endDate, endTime, timezone } = config;

    const startDateTime = DateTime.fromISO(`${startDate}T${startTime}`, {
      zone: timezone,
    });
    const endDateTime = DateTime.fromISO(`${endDate}T${endTime}`, {
      zone: timezone,
    });
    const now = DateTime.now().setZone(timezone);

    if (!startDateTime.isValid || !endDateTime.isValid) {
      console.error("Invalid date/time");
      return;
    }

    if (endDateTime <= startDateTime) {
      console.warn("End time is before start time");
      return;
    }

    const totalDuration = endDateTime.diff(startDateTime).as("milliseconds");
    const elapsed = now.diff(startDateTime).as("milliseconds");
    const remaining = endDateTime.diff(now).as("milliseconds");

    if (remaining <= 0) {
      setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setProgress(100);
      setIsExpired(true);
      return;
    }

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    setTimeRemaining({ days, hours, minutes, seconds });
    setProgress(Math.max(0, Math.min(100, (elapsed / totalDuration) * 100)));
    setIsExpired(false);
  }, [config]);

  useEffect(() => {
    if (config) {
      calculateTimeRemaining();
      const interval = setInterval(calculateTimeRemaining, 1000);
      return () => clearInterval(interval);
    }
  }, [config, calculateTimeRemaining]);

  // Animated Number (same as before)
  const AnimatedNumber = ({
    value,
    label,
  }: {
    value: number;
    label: string;
  }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [isFading, setIsFading] = useState(false);
    const prevValueRef = useRef(value);

    useEffect(() => {
      if (prevValueRef.current !== value) {
        setIsFading(true);
        const timer = setTimeout(() => {
          setDisplayValue(value);
          prevValueRef.current = value;
          setIsFading(false);
        }, 150);
        return () => clearTimeout(timer);
      }
    }, [value]);

    return (
      <div className="text-center">
        <div
          className={`text-5xl sm:text-6xl font-bold font-mono transition-opacity duration-150 ${
            isFading ? "opacity-0" : "opacity-100"
          }`}
          aria-live="polite"
        >
          {displayValue.toString().padStart(2, "0")}
        </div>
        <div className="text-sm font-medium text-foreground/70 uppercase tracking-wide mt-1">
          {label}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-panel-bg border-border">
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-foreground/70">Loading tracker...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !config) {
    return (
      <Card className="bg-panel-bg border-border">
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-red-500">Failed to load tracker.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-panel-bg border-border" aria-label={config.title}>
      <CardHeader>
        <CardTitle className="text-foreground text-center">
          {isExpired ? "🎉 Time's Up!" : config.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <p className="text-foreground/70 text-sm">
            {DateTime.now()
              .setZone(config.timezone)
              .toFormat("EEE, MMM d, yyyy 'at' h:mm a")}{" "}
            <span className="text-xs">({config.timezone})</span>
          </p>
        </div>

        <div className="grid grid-cols-2 text-accent-2 md:grid-cols-4 gap-4 sm:gap-8 mb-8">
          <AnimatedNumber value={timeRemaining.days} label="Days" />
          <AnimatedNumber value={timeRemaining.hours} label="Hours" />
          <AnimatedNumber value={timeRemaining.minutes} label="Minutes" />
          <AnimatedNumber value={timeRemaining.seconds} label="Seconds" />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm text-foreground/70">
            <span>Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="w-full bg-background rounded-full h-8 border border-border overflow-hidden"
          >
            <div
              className="h-full bg-gradient-to-r from-accent-1 via-accent-2 to-accent-3 rounded-full flex items-center justify-end pr-3 transition-all duration-300"
              style={{ width: `${progress}%` }}
            >
              {progress >= 5 && (
                <span className="text-foreground font-medium text-sm drop-shadow-sm">
                  {progress.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

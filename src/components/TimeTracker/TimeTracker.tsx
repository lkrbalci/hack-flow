"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTime } from "luxon";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function TimeTracker() {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [progress, setProgress] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [error, setError] = useState("");

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Australia/Sydney",
  ];

  // Set default dates on mount
  useEffect(() => {
    if (!startDate) setStartDate(DateTime.now().toISODate());
    if (!endDate) setEndDate(DateTime.now().plus({ days: 7 }).toISODate());
    if (!startTime) setStartTime("00:00");
    if (!endTime) setEndTime("23:59");
  }, [startDate, startTime, endDate, endTime]);

  const calculateTimeRemaining = useCallback(() => {
    setError("");

    if (!startDate || !startTime || !endDate || !endTime) {
      setError("Please fill in all date and time fields.");
      return;
    }

    const startDateTime = DateTime.fromISO(`${startDate}T${startTime}`, {
      zone: timezone,
    });
    const endDateTime = DateTime.fromISO(`${endDate}T${endTime}`, {
      zone: timezone,
    });
    const now = DateTime.now().setZone(timezone);

    if (!startDateTime.isValid) {
      setError("Invalid start date/time.");
      return;
    }
    if (!endDateTime.isValid) {
      setError("Invalid end date/time.");
      return;
    }

    if (endDateTime <= startDateTime) {
      setError("End date/time must be after start date/time.");
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

    setIsExpired(false);
    const progressPercent = Math.max(
      0,
      Math.min(100, (elapsed / totalDuration) * 100)
    );
    setProgress(progressPercent);

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    setTimeRemaining({ days, hours, minutes, seconds });
  }, [startDate, startTime, endDate, endTime, timezone]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(calculateTimeRemaining, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive, calculateTimeRemaining]);

  const handleStart = () => {
    setError("");
    const startDateTime = DateTime.fromISO(`${startDate}T${startTime}`, {
      zone: timezone,
    });
    const endDateTime = DateTime.fromISO(`${endDate}T${endTime}`, {
      zone: timezone,
    });

    if (!startDateTime.isValid || !endDateTime.isValid) {
      setError("Please enter valid date and time values.");
      return;
    }

    if (endDateTime <= startDateTime) {
      setError("End date/time must be after start date/time.");
      return;
    }

    setIsActive(true);
    calculateTimeRemaining();
  };

  const handleStop = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setError("");
    setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setProgress(0);
    setIsExpired(false);
  };

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

  return (
    <div className="space-y-8">
      {/* Configuration Panel */}
      <Card className="bg-panel-bg border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            Time Period Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="start-date"
                  className="text-foreground font-medium"
                >
                  Start Date
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label
                  htmlFor="start-time"
                  className="text-foreground font-medium"
                >
                  Start Time
                </Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="end-date"
                  className="text-foreground font-medium"
                >
                  End Date
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label
                  htmlFor="end-time"
                  className="text-foreground font-medium"
                >
                  End Time
                </Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="timezone" className="text-foreground font-medium">
              Timezone
            </Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border max-h-60">
                {timezones.map((tz) => (
                  <SelectItem
                    key={tz}
                    value={tz}
                    className="text-foreground hover:bg-panel-bg"
                  >
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded border border-red-500/20">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleStart}
              disabled={isActive}
              className="bg-accent-1 hover:bg-accent-1/90 text-foreground font-medium"
            >
              {isActive ? "Tracking..." : "Start Tracking"}
            </Button>
            <Button
              onClick={handleStop}
              disabled={!isActive}
              variant="outline"
              className="border-border text-foreground hover:bg-panel-bg"
            >
              Stop
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-border text-foreground hover:bg-panel-bg"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Time Display */}
      {(isActive || isExpired || progress > 0) && (
        <Card
          className="bg-panel-bg border-border"
          aria-label="Time Progress Tracker"
        >
          <CardContent className="pt-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {isExpired ? "🎉 Time Period Complete!" : "⏰ Time Remaining"}
              </h2>
              <p className="text-foreground/70 text-sm mt-1">
                {DateTime.now()
                  .setZone(timezone)
                  .toFormat("EEE, MMM d, yyyy 'at' h:mm a")}{" "}
                ({timezone})
              </p>
            </div>

            <div className="grid grid-cols-2 text-accent-2 md:grid-cols-4 gap-4 sm:gap-8 mb-8">
              <AnimatedNumber value={timeRemaining.days} label="Days" />
              <AnimatedNumber value={timeRemaining.hours} label="Hours" />
              <AnimatedNumber value={timeRemaining.minutes} label="Minutes" />
              <AnimatedNumber value={timeRemaining.seconds} label="Seconds" />
            </div>

            {/* Progress Bar */}
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
      )}

      {/* Inactive Placeholder */}
      {!isActive && !isExpired && progress === 0 && (
        <div className="text-center text-foreground/60 text-lg mt-6">
          Configure the time period and click &quot;Start Tracking&quot; to
          begin.
        </div>
      )}
    </div>
  );
}

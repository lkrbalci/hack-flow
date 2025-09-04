// src/lib/api/timeTrackerApi.ts
import { DateTime } from "luxon";

// Simulate API delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface TimeTrackerConfig {
  id: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timezone: string;
}

// Mock response
export async function fetchTimeTrackerConfig(): Promise<TimeTrackerConfig> {
  await sleep(300); // Simulate network delay

  return {
    id: "tracker-1",
    title: "Project Deadline",
    startDate: "2025-04-01",
    startTime: "09:00",
    endDate: "2025-09-15",
    endTime: "17:00",
    timezone: "America/New_York",
  };
}

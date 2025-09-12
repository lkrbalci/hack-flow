"use client";

import { useQuery } from "@tanstack/react-query";
import { AppwriteException } from "appwrite";
import { toast } from "sonner";
import { tablesDB } from "@/lib/appwrite";
import { TimeTracker } from "@/types/timeTracker";
import { useEffect } from "react";
import { Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const TIME_TRACKERS_TABLE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_TIME_TRACKERS_COLLECTION_ID!;

export const fetchTimeTrackers = async (): Promise<TimeTracker[]> => {
  const response = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: TIME_TRACKERS_TABLE_ID,
    queries: [Query.limit(50)],
  });

  return response.rows.map((row) => ({
    $id: row.$id,
    $createdAt: row.$createdAt,
    $updatedAt: row.$updatedAt,
    startDate: row.startDate,
    startTime: row.startTime,
    endDate: row.endDate,
    endTime: row.endTime,
    hackathonTimezone: row.hackathonTimezone,
    userTimezone: row.userTimezone,
    userId: row.userId,
  })) as unknown as TimeTracker[];
};

export const fetchUserTimeTracker = async (
  userId: string
): Promise<TimeTracker | null> => {
  const response = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: TIME_TRACKERS_TABLE_ID,
    queries: [Query.equal("userId", userId), Query.limit(1)],
  });

  if (response.rows.length === 0) {
    return null;
  }

  const row = response.rows[0];
  return {
    $id: row.$id,
    $createdAt: row.$createdAt,
    $updatedAt: row.$updatedAt,
    startDate: row.startDate,
    startTime: row.startTime,
    endDate: row.endDate,
    endTime: row.endTime,
    hackathonTimezone: row.hackathonTimezone,
    userTimezone: row.userTimezone,
    userId: row.userId,
  } as TimeTracker;
};

const getRetryDelay = (attemptIndex: number) => {
  return Math.min(1000 * 2 ** attemptIndex, 5000);
};

export const useTimeTrackersQuery = () => {
  const query = useQuery({
    queryKey: ["timeTrackers"],
    queryFn: fetchTimeTrackers,

    retry: 2,
    retryDelay: getRetryDelay,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,

    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      console.log(
        `✅ [useTimeTrackersQuery] Successfully loaded ${query.data.length} time trackers`
      );
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError && query.error) {
      const error = query.error;
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 401:
            toast.error("Unauthorized. Please log in.");
            break;
          case 404:
            toast.error("Time trackers collection not found.");
            break;
          default:
            toast.error("Failed to load time trackers. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
      console.error(
        "❌ [useTimeTrackersQuery] Failed to fetch time trackers:",
        error
      );
    }
  }, [query.isError, query.error]);

  return query;
};

export const useUserTimeTrackerQuery = (userId: string) => {
  const query = useQuery({
    queryKey: ["timeTracker", userId],
    queryFn: () => fetchUserTimeTracker(userId),
    enabled: !!userId,

    retry: 2,
    retryDelay: getRetryDelay,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,

    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.isError && query.error) {
      const error = query.error;
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 401:
            toast.error("Unauthorized. Please log in.");
            break;
          case 404:
            toast.error("Time tracker not found.");
            break;
          default:
            toast.error("Failed to load time tracker. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
      console.error(
        "❌ [useUserTimeTrackerQuery] Failed to fetch time tracker:",
        error
      );
    }
  }, [query.isError, query.error]);

  return query;
};

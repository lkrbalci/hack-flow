"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ID, AppwriteException } from "appwrite";
import { toast } from "sonner";
import { tablesDB } from "@/lib/appwrite";
import { TimeTracker } from "@/types/timeTracker";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const TIME_TRACKERS_TABLE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_TIME_TRACKERS_COLLECTION_ID!;

interface CreateTimeTrackerData {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  hackathonTimezone: string;
  userTimezone: string;
  userId: string;
}

interface UpdateTimeTrackerData {
  timeTrackerId: string;
  data: Partial<TimeTracker>;
}

interface UpdateTimeTrackerFieldData {
  timeTrackerId: string;
  field: string;
  value: string;
}

interface DeleteTimeTrackerData {
  timeTrackerId: string;
}

const createTimeTracker = async (data: CreateTimeTrackerData) => {
  return tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: TIME_TRACKERS_TABLE_ID,
    rowId: ID.unique(),
    data,
  });
};

const updateTimeTracker = async ({
  timeTrackerId,
  data,
}: UpdateTimeTrackerData) => {
  return tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: TIME_TRACKERS_TABLE_ID,
    rowId: timeTrackerId,
    data,
  });
};

const updateTimeTrackerField = async ({
  timeTrackerId,
  field,
  value,
}: UpdateTimeTrackerFieldData) => {
  return tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: TIME_TRACKERS_TABLE_ID,
    rowId: timeTrackerId,
    data: {
      [field]: value,
    },
  });
};

const deleteTimeTracker = async ({ timeTrackerId }: DeleteTimeTrackerData) => {
  return tablesDB.deleteRow({
    databaseId: DATABASE_ID,
    tableId: TIME_TRACKERS_TABLE_ID,
    rowId: timeTrackerId,
  });
};

const getRetryDelay = (attemptIndex: number) => {
  return Math.min(1000 * 2 ** attemptIndex, 5000);
};

export function useCreateTimeTracker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTimeTracker,
    retry: 2,
    retryDelay: getRetryDelay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeTrackers"] });
      queryClient.invalidateQueries({ queryKey: ["timeTracker"] });
      toast.success("Time tracker created successfully!");
    },
    onError: (error) => {
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 400:
            toast.error("Invalid time tracker data. Please check your input.");
            break;
          case 401:
            toast.error("Unauthorized. Please log in.");
            break;
          case 409:
            toast.error("Time tracker already exists.");
            break;
          case 429:
            toast.error("Too many requests. Please try again later.");
            break;
          default:
            toast.error("Failed to create time tracker. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    },
  });
}

export function useUpdateTimeTracker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTimeTracker,
    retry: 2,
    retryDelay: getRetryDelay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeTrackers"] });
      queryClient.invalidateQueries({ queryKey: ["timeTracker"] });
      toast.success("Time tracker updated successfully!");
    },
    onError: (error) => {
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 400:
            toast.error("Invalid time tracker data.");
            break;
          case 401:
            toast.error("Unauthorized. Please log in.");
            break;
          case 404:
            toast.error("Time tracker not found.");
            break;
          default:
            toast.error("Failed to update time tracker. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    },
  });
}

export function useUpdateTimeTrackerField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTimeTrackerField,
    retry: 2,
    retryDelay: getRetryDelay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeTrackers"] });
      queryClient.invalidateQueries({ queryKey: ["timeTracker"] });
    },
    onError: (error) => {
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 400:
            toast.error("Invalid field data.");
            break;
          case 401:
            toast.error("Unauthorized. Please log in.");
            break;
          case 404:
            toast.error("Time tracker not found.");
            break;
          default:
            toast.error("Failed to update field. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    },
  });
}

export function useDeleteTimeTracker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTimeTracker,
    retry: 2,
    retryDelay: getRetryDelay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeTrackers"] });
      queryClient.invalidateQueries({ queryKey: ["timeTracker"] });
      toast.success("Time tracker deleted successfully!");
    },
    onError: (error) => {
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 401:
            toast.error("Unauthorized. Please log in.");
            break;
          case 404:
            toast.error("Time tracker not found.");
            break;
          default:
            toast.error("Failed to delete time tracker. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    },
  });
}

// Field-specific update hooks
export function useUpdateTimeTrackerStartDate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeTrackerId,
      startDate,
    }: {
      timeTrackerId: string;
      startDate: string;
    }) =>
      updateTimeTrackerField({
        timeTrackerId,
        field: "startDate",
        value: startDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeTrackers"] });
      queryClient.invalidateQueries({ queryKey: ["timeTracker"] });
    },
  });
}

export function useUpdateTimeTrackerStartTime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeTrackerId,
      startTime,
    }: {
      timeTrackerId: string;
      startTime: string;
    }) =>
      updateTimeTrackerField({
        timeTrackerId,
        field: "startTime",
        value: startTime,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeTrackers"] });
      queryClient.invalidateQueries({ queryKey: ["timeTracker"] });
    },
  });
}

export function useUpdateTimeTrackerEndDate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeTrackerId,
      endDate,
    }: {
      timeTrackerId: string;
      endDate: string;
    }) =>
      updateTimeTrackerField({
        timeTrackerId,
        field: "endDate",
        value: endDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeTrackers"] });
      queryClient.invalidateQueries({ queryKey: ["timeTracker"] });
    },
  });
}

export function useUpdateTimeTrackerEndTime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeTrackerId,
      endTime,
    }: {
      timeTrackerId: string;
      endTime: string;
    }) =>
      updateTimeTrackerField({
        timeTrackerId,
        field: "endTime",
        value: endTime,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeTrackers"] });
      queryClient.invalidateQueries({ queryKey: ["timeTracker"] });
    },
  });
}

export function useUpdateTimeTrackerHackathonTimezone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeTrackerId,
      hackathonTimezone,
    }: {
      timeTrackerId: string;
      hackathonTimezone: string;
    }) =>
      updateTimeTrackerField({
        timeTrackerId,
        field: "hackathonTimezone",
        value: hackathonTimezone,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeTrackers"] });
      queryClient.invalidateQueries({ queryKey: ["timeTracker"] });
    },
  });
}

export function useUpdateTimeTrackerUserTimezone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeTrackerId,
      userTimezone,
    }: {
      timeTrackerId: string;
      userTimezone: string;
    }) =>
      updateTimeTrackerField({
        timeTrackerId,
        field: "userTimezone",
        value: userTimezone,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeTrackers"] });
      queryClient.invalidateQueries({ queryKey: ["timeTracker"] });
    },
  });
}

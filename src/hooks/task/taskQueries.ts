"use client";

import { useQuery } from "@tanstack/react-query";
import { AppwriteException } from "appwrite";
import { toast } from "sonner";
import { tablesDB } from "@/lib/appwrite";
import { Task } from "@/types/task";
import { useEffect } from "react";
import { Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const TASKS_TABLE_ID = process.env.NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID!;

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: TASKS_TABLE_ID,
    queries: [Query.limit(50)],
  });

  return response.rows.map((row) => ({
    $id: row.$id,
    $createdAt: row.$createdAt,
    $updatedAt: row.$updatedAt,
    title: row.title,
    projectId: row.projectId,
    effortEstimate: row.effortEstimate,
    status: row.status,
    order: row.order,
  })) as unknown as Task[];
};

const getRetryDelay = (attemptIndex: number) => {
  return Math.min(1000 * 2 ** attemptIndex, 5000);
};

export const useTasksQuery = (options = {}) => {
  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,

    retry: 2,
    retryDelay: getRetryDelay,

    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)

    refetchOnWindowFocus: false,
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      console.log(
        `✅ [useTasksQuery] Successfully loaded ${query.data.length} tasks`
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
            toast.error("Tasks collection not found.");
            break;
          default:
            toast.error("Failed to load tasks. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
      console.error("❌ [useTasksQuery] Failed to fetch tasks:", error);
    }
  }, [query.isError, query.error]);

  return query;
};

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ID, AppwriteException } from "appwrite";
import { toast } from "sonner";
import { tablesDB } from "@/lib/appwrite";
import { Task } from "@/types/task";

// Constants
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const TASKS_TABLE_ID = process.env.NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID!;

// Interfaces
interface CreateTaskData {
  title: string;
  projectId: string;
  effortEstimate: number;
  status: "active" | "done";
  order: number;
}

interface UpdateTaskOrderData {
  tasks: Array<{ id: string; order: number }>;
}

interface UpdateTaskStatusData {
  taskId: string;
  status: "active" | "done";
}

interface UpdateTaskData {
  taskId: string;
  data: Partial<Task>;
}

interface DeleteTaskData {
  taskId: string;
}

// Mutation Functions
const createTask = async (data: CreateTaskData) => {
  return tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: TASKS_TABLE_ID,
    rowId: ID.unique(),
    data,
  });
};

const updateTaskOrder = async (data: UpdateTaskOrderData) => {
  const promises = data.tasks.map((task) =>
    tablesDB.updateRow({
      databaseId: DATABASE_ID,
      tableId: TASKS_TABLE_ID,
      rowId: task.id,
      data: {
        order: task.order,
      },
    })
  );
  return Promise.all(promises);
};

const updateTaskStatus = async ({ taskId, status }: UpdateTaskStatusData) => {
  return tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: TASKS_TABLE_ID,
    rowId: taskId,
    data: {
      status,
    },
  });
};

const updateTask = async ({ taskId, data }: UpdateTaskData) => {
  return tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: TASKS_TABLE_ID,
    rowId: taskId,
    data,
  });
};

const deleteTask = async ({ taskId }: DeleteTaskData) => {
  return tablesDB.deleteRow({
    databaseId: DATABASE_ID,
    tableId: TASKS_TABLE_ID,
    rowId: taskId,
  });
};

// Shared retry delay helper
const getRetryDelay = (attemptIndex: number) => {
  return Math.min(1000 * 2 ** attemptIndex, 5000);
};

// Mutation Hooks
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    retry: 2,
    retryDelay: getRetryDelay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully!");
      console.log("✅ [useCreateTask] Task created and cache invalidated");
    },
    onError: (error) => {
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 400:
            toast.error("Invalid task data. Please check your input.");
            break;
          case 401:
            toast.error("Unauthorized. Please log in.");
            break;
          case 409:
            toast.error("Task already exists.");
            break;
          case 429:
            toast.error("Too many requests. Please try again later.");
            break;
          default:
            toast.error("Failed to create task. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
      console.error("Create task failed:", error);
    },
  });
}

export function useUpdateTaskOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTaskOrder,
    retry: 2,
    retryDelay: getRetryDelay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      console.log(
        "✅ [useUpdateTaskOrder] Task order updated and cache invalidated"
      );
    },
    onError: (error) => {
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 400:
            toast.error("Invalid order data.");
            break;
          case 401:
            toast.error("Unauthorized. Please log in.");
            break;
          case 404:
            toast.error("Task not found.");
            break;
          default:
            toast.error("Failed to update task order. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
      console.error("Update task order failed:", error);
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTaskStatus,
    retry: 2,
    retryDelay: getRetryDelay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      console.log(
        "✅ [useUpdateTaskStatus] Task status updated and cache invalidated"
      );
    },
    onError: (error) => {
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 400:
            toast.error("Invalid status data.");
            break;
          case 401:
            toast.error("Unauthorized. Please log in.");
            break;
          case 404:
            toast.error("Task not found.");
            break;
          default:
            toast.error("Failed to update task status. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
      console.error("Update task status failed:", error);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    retry: 2,
    retryDelay: getRetryDelay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated successfully!");
      console.log("✅ [useUpdateTask] Task updated and cache invalidated");
    },
    onError: (error) => {
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 400:
            toast.error("Invalid task data.");
            break;
          case 401:
            toast.error("Unauthorized. Please log in.");
            break;
          case 404:
            toast.error("Task not found.");
            break;
          default:
            toast.error("Failed to update task. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
      console.error("Update task failed:", error);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    retry: 2,
    retryDelay: getRetryDelay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully!");
      console.log("✅ [useDeleteTask] Task deleted and cache invalidated");
    },
    onError: (error) => {
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 401:
            toast.error("Unauthorized. Please log in.");
            break;
          case 404:
            toast.error("Task not found.");
            break;
          default:
            toast.error("Failed to delete task. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
      console.error("Delete task failed:", error);
    },
  });
}

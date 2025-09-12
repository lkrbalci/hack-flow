"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ID, AppwriteException } from "appwrite";
import { toast } from "sonner";
import { tablesDB } from "@/lib/appwrite";
import { Project } from "@/types/project";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const PROJECTS_TABLE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID!;

interface CreateProjectData {
  title: string;
  userId: string;
  order: number;
}

interface UpdateProjectOrderData {
  projects: Array<{ id: string; order: number }>;
}

interface UpdateProjectData {
  projectId: string;
  data: Partial<Project>; // ✅ Added 'data:' prefix
}

interface DeleteProjectData {
  projectId: string;
}

// Mutation Functions
const createProject = async (data: CreateProjectData) => {
  return tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: PROJECTS_TABLE_ID,
    rowId: ID.unique(),
    data,
  });
};

const updateProjectOrder = async (data: UpdateProjectOrderData) => {
  const promises = data.projects.map((project) =>
    tablesDB.updateRow({
      databaseId: DATABASE_ID,
      tableId: PROJECTS_TABLE_ID,
      rowId: project.id,
      data: {
        order: project.order,
      },
    })
  );
  return Promise.all(promises);
};

const updateProject = async ({ projectId, data }: UpdateProjectData) => {
  return tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: PROJECTS_TABLE_ID,
    rowId: projectId,
    data,
  });
};

const deleteProject = async ({ projectId }: DeleteProjectData) => {
  return tablesDB.deleteRow({
    databaseId: DATABASE_ID,
    tableId: PROJECTS_TABLE_ID,
    rowId: projectId,
  });
};

const getRetryDelay = (attemptIndex: number) => {
  return Math.min(1000 * 2 ** attemptIndex, 5000);
};

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    retry: 2,
    retryDelay: getRetryDelay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully!");
      console.log(
        "✅ [useCreateProject] Project created and cache invalidated"
      );
    },
    onError: (error) => {
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 400:
            toast.error("Invalid project data. Please check your input.");
            break;
          case 401:
            toast.error("Unauthorized. Please log in.");
            break;
          case 409:
            toast.error("Project already exists.");
            break;
          case 429:
            toast.error("Too many requests. Please try again later.");
            break;
          default:
            toast.error("Failed to create project. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
      console.error("Create project failed:", error);
    },
  });
}

export function useUpdateProjectOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectOrder,
    retry: 2,
    retryDelay: getRetryDelay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      console.log(
        "✅ [useUpdateProjectOrder] Project order updated and cache invalidated"
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
            toast.error("Project not found.");
            break;
          default:
            toast.error("Failed to update project order. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
      console.error("Update project order failed:", error);
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProject,
    retry: 2,
    retryDelay: getRetryDelay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully!");
      console.log(
        "✅ [useUpdateProject] Project updated and cache invalidated"
      );
    },
    onError: (error) => {
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 400:
            toast.error("Invalid project data.");
            break;
          case 401:
            toast.error("Unauthorized. Please log in.");
            break;
          case 404:
            toast.error("Project not found.");
            break;
          default:
            toast.error("Failed to update project. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
      console.error("Update project failed:", error);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    retry: 2,
    retryDelay: getRetryDelay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Also clear tasks
      toast.success("Project deleted successfully!");
      console.log(
        "✅ [useDeleteProject] Project deleted and cache invalidated"
      );
    },
    onError: (error) => {
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 401:
            toast.error("Unauthorized. Please log in.");
            break;
          case 404:
            toast.error("Project not found.");
            break;
          default:
            toast.error("Failed to delete project. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
      console.error("Delete project failed:", error);
    },
  });
}

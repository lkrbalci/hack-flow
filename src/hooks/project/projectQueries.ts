"use client";

import { useQuery } from "@tanstack/react-query";
import { AppwriteException } from "appwrite";
import { toast } from "sonner";
import { account, tablesDB } from "@/lib/appwrite";
import { Project } from "@/types/project";
import { useEffect } from "react";
import { Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const PROJECTS_TABLE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID!;

export const fetchProjects = async (): Promise<Project[]> => {
  const session = await account.get();
  if (!session) {
    console.log("No valid session");
  }
  const response = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: PROJECTS_TABLE_ID,
    queries: [Query.limit(10)],
  });

  return response.rows.map((row) => ({
    $id: row.$id,
    $createdAt: row.$createdAt,
    $updatedAt: row.$updatedAt,
    ...row.data,
  })) as unknown as Project[];
};

const getRetryDelay = (attemptIndex: number) => {
  return Math.min(1000 * 2 ** attemptIndex, 5000); // 1s, 2s, 4s, cap at 5s
};

export const useProjectsQuery = () => {
  const query = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,

    retry: 2,
    retryDelay: getRetryDelay,

    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes

    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      console.log(
        `✅ [useProjectsQuery] Successfully loaded ${query.data.length} projects`
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
            toast.error("Projects collection not found.");
            break;
          default:
            toast.error("Failed to load projects. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
      console.error("❌ [useProjectsQuery] Failed to fetch projects:", error);
    }
  }, [query.isError, query.error]);

  return query;
};

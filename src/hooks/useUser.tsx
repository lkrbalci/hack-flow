"use client";

import { useQuery } from "@tanstack/react-query";
import { account } from "../lib/appwrite";
import { AppwriteException, Models } from "appwrite";

async function fetchCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    if (error instanceof AppwriteException && error.code === 401) {
      return null;
    }
    console.warn("Failed to fetch user:", error);
    throw error;
  }
}

export function useUser() {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const hasCheckedAuth = !isLoading;
  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    isError,
    error,
    isAuthenticated,
    hasCheckedAuth,
    refetch,
  };
}

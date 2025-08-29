"use client";

import { useQuery } from "@tanstack/react-query";
import { account } from "../lib/appwrite";
import { AppwriteException, Models } from "appwrite";

const fetchCurrentUser =
  async (): Promise<Models.User<Models.Preferences> | null> => {
    try {
      const user = await account.get();
      return user;
    } catch (error) {
      if (error instanceof AppwriteException && error.code === 401) {
        return null;
      }
      throw error;
    }
  };

export function useUser() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["currentUser"],

    queryFn: fetchCurrentUser,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    user: data,
    isLoading,
    isError,
    error,
    isAuthenticated: !!data,
  };
}

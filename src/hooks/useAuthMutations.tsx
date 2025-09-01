"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { account } from "../lib/appwrite";
import { ID } from "appwrite";
import { LoginCredentials, RegisterCredentials } from "../types/auth";
import { toast } from "sonner";
import { AppwriteException } from "appwrite";

const loginUser = async (credentials: LoginCredentials) => {
  return account.createEmailPasswordSession({
    email: credentials.email,
    password: credentials.password,
  });
};

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast("Welcome back!");
    },
    onError: (error) => {
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 401:
            toast("Invalid credentials.");
            break;
          case 429:
            toast("Too many attempts. Please try again later.");
            break;
          default:
            toast("Login failed. Please try again.");
        }
      } else {
        toast("Network error. Are you online?");
      }
      console.error("Login failed:", error);
    },
  });
}

const registerUser = async (credentials: RegisterCredentials) => {
  await account.create({
    userId: ID.unique(),
    email: credentials.email,
    password: credentials.password,
    name: credentials.name,
  });
  return account.createEmailPasswordSession({
    email: credentials.email,
    password: credentials.password,
  });
};

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast("Account created! Welcome aboard!");
    },
    onError: (error) => {
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 409:
            toast("Email already in use. Try logging in.");
            break;
          case 400:
            toast("Invalid data. Please check your input.");
            break;
          case 429:
            toast("Too many attempts. Please try again later.");
            break;
          default:
            toast("Registration failed. Please try again.");
        }
      } else {
        toast("Network error. Are you online?");
      }
      console.error("Registration failed:", error);
    },
  });
}

const logoutUser = async () => {
  return account.deleteSession({ sessionId: "current" });
};

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast("You’ve been logged out.");
    },
    onError: (error) => {
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 401:
          case 404:
            // Already logged out or session gone
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            toast("You were already logged out.");
            break;
          default:
            toast("Logout failed. Please try again.");
        }
      } else {
        toast("Network error. Please check your connection.");
      }
      console.error("Logout failed:", error);
    },
  });
}

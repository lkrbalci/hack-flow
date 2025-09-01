"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { account } from "../lib/appwrite";
import { ID } from "appwrite";
import { LoginCredentials, RegisterCredentials } from "../types/auth";

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
    },
    onError: (error) => {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
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
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      alert("Registration failed. The user may already exist.");
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
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    },
  });
}

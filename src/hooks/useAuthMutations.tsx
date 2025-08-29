"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { account } from "../lib/appwrite";
import { ID } from "appwrite";
import { LoginCredentials, RegisterCredentials } from "../types/auth"; // We'll create this types file next

// --- Login Mutation ---
const loginUser = async (credentials: LoginCredentials) => {
  return account.createEmailPasswordSession({
    email: credentials.email,
    password: credentials.password,
  });
};

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      // When login is successful, invalidate the 'currentUser' query
      // to trigger a refetch and update the user's auth state.
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      router.push("/dashboard"); // Redirect to a protected route
    },
    onError: (error) => {
      // You can handle errors here, e.g., show a toast notification.
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    },
  });
}

// --- Register Mutation ---
const registerUser = async (credentials: RegisterCredentials) => {
  // Appwrite registration requires a unique ID for the user
  await account.create({
    userId: ID.unique(),
    email: credentials.email,
    password: credentials.password,
    name: credentials.name,
  });
  // After creating the account, automatically log the user in
  return account.createEmailPasswordSession({
    email: credentials.email,
    password: credentials.password,
  });
};

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      // After successful registration and login, invalidate the currentUser query
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      router.push("/dashboard"); // Redirect to a protected route
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      alert("Registration failed. The user may already exist.");
    },
  });
}

// --- Logout Mutation ---
const logoutUser = async () => {
  return account.deleteSession("current");
};

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // After logout, invalidate the currentUser query to clear the user state.
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      router.push("/login"); // Redirect to the login page
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    },
  });
}

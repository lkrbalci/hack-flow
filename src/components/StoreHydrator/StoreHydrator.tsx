"use client";

import { useUser } from "@/hooks/useUser";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export function StoreHydrator() {
  const { user, isLoading } = useUser();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (!isLoading && user !== undefined) {
      setUser(user);
    }
  }, [user, isLoading, setUser]);

  return null;
}

"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import React from "react";

// Spinner
const FullPageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "1.5rem",
    }}
  >
    Loading...
  </div>
);

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <FullPageLoader />;
}

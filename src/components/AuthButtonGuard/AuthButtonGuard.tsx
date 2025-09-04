"use client";

import { useUser } from "@/hooks/useUser";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ReactNode,
  useState,
  cloneElement,
  useCallback,
  ButtonHTMLAttributes,
} from "react";

// Mock login/signup forms (replace with real ones)
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <h3 className="text-lg font-medium mb-4">Log In</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Simulate login success
          console.log("Logged in!");
          onSuccess();
        }}
      >
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-3"
          required
        />
        <Button type="submit" className="w-full">
          Log In
        </Button>
      </form>
    </div>
  );
}

function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <h3 className="text-lg font-medium mb-4">Sign Up</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Simulate sign-up success
          console.log("Signed up!");
          onSuccess();
        }}
      >
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-3"
          required
        />
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </div>
  );
}

interface AuthButtonGuardProps {
  children: ReactNode;
  onAuthSuccess?: () => void; // Optional: custom action after login
}

export function AuthButtonGuard({
  children,
  onAuthSuccess,
}: AuthButtonGuardProps) {
  const { isAuthenticated, isLoading } = useUser();
  const [open, setOpen] = useState(false);

  // Handle successful authentication
  const handleAuthSuccess = useCallback(() => {
    setOpen(false);
    // Execute the original action after auth
    if (onAuthSuccess) {
      onAuthSuccess();
    }
  }, [onAuthSuccess]);

  // If loading, just render children (or disable if preferred)
  if (isLoading) {
    return <>{children}</>;
  }

  // If already authenticated, allow normal behavior
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Wrap the button to intercept click
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {cloneElement(
          children as React.ReactElement<
            ButtonHTMLAttributes<HTMLButtonElement>
          >,
          {
            // Prevent default action, just open dialog
            onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            },
          }
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Log In or Sign Up</DialogTitle>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm onSuccess={handleAuthSuccess} />
          </TabsContent>
          <TabsContent value="signup">
            <SignUpForm onSuccess={handleAuthSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

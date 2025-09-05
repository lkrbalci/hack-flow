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
import { useLogin, useRegister } from "@/hooks/useAuthMutations";

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { mutate: login, isPending } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { email, password },
      {
        onSuccess,
      }
    );
  };

  return (
    <div className="p-6 bg-panel-bg border border-border rounded-lg">
      <h3 className="text-lg font-medium mb-4 text-foreground">Log In</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
          required
        />
        <Button
          type="submit"
          className="w-1/2 bg-accent-1"
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "Log In"}
        </Button>
      </form>
    </div>
  );
}

function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
  const { mutate: register, isPending } = useRegister();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(
      { email, password, name },
      {
        onSuccess,
      }
    );
  };

  return (
    <div className="p-6 bg-panel-bg border border-border rounded-lg">
      <h3 className="text-lg font-medium mb-4 text-foreground">Sign Up</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
          required
        />
        <Button
          type="submit"
          className="w-1/2 bg-accent-1"
          disabled={isPending}
        >
          {isPending ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
}

interface AuthButtonGuardProps {
  children: ReactNode;
  onAuthSuccess?: () => void;
}

export function AuthButtonGuard({
  children,
  onAuthSuccess,
}: AuthButtonGuardProps) {
  const { isAuthenticated, isLoading } = useUser();
  const [open, setOpen] = useState(false);

  const handleAuthSuccess = useCallback(() => {
    setOpen(false);
    if (onAuthSuccess) {
      onAuthSuccess();
    }
  }, [onAuthSuccess]);

  if (isLoading) {
    return <>{children}</>;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {cloneElement(
          children as React.ReactElement<
            ButtonHTMLAttributes<HTMLButtonElement>
          >,
          {
            onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            },
          }
        )}
      </DialogTrigger>
      <DialogContent className="bg-panel-bg border-border text-foreground max-w-md mx-auto p-0 rounded-xl overflow-hidden shadow-lg">
        <DialogTitle className="p-4 text-center text-lg font-semibold border-b border-border bg-background">
          🔐 Authentication Required
        </DialogTitle>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-1/2 grid-cols-2 bg-background border-b border-border mx-4">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-accent-1 data-[state=active]:text-foreground"
            >
              Log In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="data-[state=active]:bg-accent-1 data-[state=active]:text-foreground"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="p-4">
            <LoginForm onSuccess={handleAuthSuccess} />
          </TabsContent>
          <TabsContent value="signup" className="p-4">
            <SignUpForm onSuccess={handleAuthSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

import { AuthButtonGuard } from "@/components/AuthButtonGuard/AuthButtonGuard";
import { Button } from "@/components/ui/button";

export function LoginRequiredBanner() {
  return (
    <div className="space-y-3 bg-panel-bg border border-border rounded-xl p-6">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-foreground mb-2">
          Login Required
        </h3>
        <p className="text-foreground/60 text-sm mb-6">
          Please log in to access the time tracker and other features.
        </p>
        <AuthButtonGuard>
          <Button className="bg-accent-1 text-foreground">
            Login to Continue
          </Button>
        </AuthButtonGuard>
      </div>
    </div>
  );
}

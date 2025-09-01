import { TimeTracker } from "@/components/TimeTracker/TimeTracker";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Time Progress Tracker
          </h1>
          <p className="text-foreground/70 text-lg">
            Set your time period and watch the progress unfold
          </p>
        </div>
        <TimeTracker />
      </div>
    </main>
  );
}

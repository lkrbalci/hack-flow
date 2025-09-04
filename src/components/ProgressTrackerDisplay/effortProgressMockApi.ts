interface Task {
  id: string;
  title: string;
  effortEstimate: number;
  status: string;
  order: number;
  createdAt: Date;
}

// Simulate delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface EffortSummary {
  totalEffort: number;
  completedEffort: number;
  completedCount: number;
  totalCount: number;
  percentage: number;
}

export async function fetchEffortProgress(): Promise<EffortSummary> {
  await sleep(300);

  // Mock tasks
  const tasks: Task[] = [
    {
      id: "1",
      title: "Design System",
      effortEstimate: 8,
      status: "done",
      order: 100,
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "API Integration",
      effortEstimate: 5,
      status: "done",
      order: 200,
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "User Auth",
      effortEstimate: 6,
      status: "active",
      order: 300,
      createdAt: new Date(),
    },
    {
      id: "4",
      title: "Dashboard UI",
      effortEstimate: 4,
      status: "active",
      order: 400,
      createdAt: new Date(),
    },
    {
      id: "5",
      title: "Testing",
      effortEstimate: 3,
      status: "todo",
      order: 500,
      createdAt: new Date(),
    },
    {
      id: "6",
      title: "Deployment",
      effortEstimate: 2,
      status: "todo",
      order: 600,
      createdAt: new Date(),
    },
  ];

  const totalEffort = tasks.reduce((sum, t) => sum + t.effortEstimate, 0);
  const completedEffort = tasks
    .filter((t) => t.status === "done")
    .reduce((sum, t) => sum + t.effortEstimate, 0);

  const percentage =
    totalEffort > 0 ? (completedEffort / totalEffort) * 100 : 0;

  return {
    totalEffort,
    completedEffort,
    completedCount: tasks.filter((t) => t.status === "done").length,
    totalCount: tasks.length,
    percentage,
  };
}

export interface Task {
  $id: string;
  title: string;
  projectId: string;
  effortEstimate: number;
  status: "active" | "done";
  order: number;
  $createdAt: string;
}

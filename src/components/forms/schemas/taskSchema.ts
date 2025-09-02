import { z } from "zod";

export const taskSchema = z.object({
  name: z.string().min(1, "Task Name is Required").max(100),
  effortEstimate: z.number().min(1).max(10),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

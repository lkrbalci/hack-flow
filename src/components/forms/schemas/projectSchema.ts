import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Project Name is Required").max(100),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { projectSchema, ProjectFormValues } from "./schemas/projectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useCreateProject } from "@/hooks/project/projectMutations";
import { Project } from "@/types/project";

type ProjectFormProps = {
  closeSheet: () => void;
  projects: Project[];
  userId: string;
};

export function ProjectForm({
  closeSheet,
  projects,
  userId,
}: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
    },
  });

  const { mutate: createProject, isPending } = useCreateProject();

  const { handleSubmit, reset } = form;

  useEffect(() => {
    reset();
  }, [reset]);

  const onSubmit = async (data: ProjectFormValues) => {
    const maxOrder =
      projects.length > 0 ? Math.max(...projects.map((p) => p.order || 1)) : 1;
    try {
      closeSheet();
      await createProject({ ...data, order: maxOrder + 1, userId });
      toast("Project Saved");
    } catch {
      toast("Failed to save project");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm leading-none select-none text-foreground font-medium group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                  Project Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Project Name"
                    {...field}
                    data-slot="input"
                    className="mt-2 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background border-border text-foreground"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-wrap gap-3 justify-end pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={closeSheet}
            disabled={false}
            className="border bg-background shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 border-border text-foreground hover:bg-panel-bg inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs h-9 px-4 py-2 has-[>svg]:px-3 bg-accent-1 hover:bg-accent-1/90 text-foreground font-medium"
          >
            {form.formState.isSubmitting || isPending ? "Saving" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

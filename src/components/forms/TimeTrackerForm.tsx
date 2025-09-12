// src/forms/TimeTrackerForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  TimeTrackerFormValues,
  timeTrackerSchemaWithValidation,
} from "./schemas/timeTrackerSchema";
import {
  useCreateTimeTracker,
  useUpdateTimeTracker,
} from "@/hooks/timeTracker/timeTrackerMutations";
import { useUserTimeTrackerQuery } from "@/hooks/timeTracker/timeTrackerQueries";

type TimeTrackerFormProps = {
  closeSheet: () => void;
  userId: string;
};

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

export function TimeTrackerForm({ closeSheet, userId }: TimeTrackerFormProps) {
  const {
    data: userTimeTracker,
    isLoading,
    isError,
  } = useUserTimeTrackerQuery(userId);

  const isEditing = !!userTimeTracker;

  const form = useForm<TimeTrackerFormValues>({
    resolver: zodResolver(timeTrackerSchemaWithValidation),
    defaultValues: {
      startDate: userTimeTracker?.startDate || "",
      startTime: userTimeTracker?.startTime || "",
      endDate: userTimeTracker?.endDate || "",
      endTime: userTimeTracker?.endTime || "",
      hackathonTimezone: userTimeTracker?.hackathonTimezone || "",
      userTimezone: userTimeTracker?.userTimezone || "",
    },
  });

  const { mutate: createTracker, isPending: isCreating } =
    useCreateTimeTracker();
  const { mutate: updateTracker, isPending: isUpdating } =
    useUpdateTimeTracker();

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (userTimeTracker) {
      reset({
        startDate: userTimeTracker.startDate,
        startTime: userTimeTracker.startTime,
        endDate: userTimeTracker.endDate,
        endTime: userTimeTracker.endTime,
        hackathonTimezone: userTimeTracker.hackathonTimezone,
        userTimezone: userTimeTracker.userTimezone,
      });
    }
  }, [userTimeTracker, reset]);

  const onSubmit = async (data: TimeTrackerFormValues) => {
    try {
      if (isEditing) {
        await new Promise((resolve) => {
          updateTracker(
            {
              timeTrackerId: userTimeTracker.$id,
              data: data,
            },
            {
              onSuccess: () => {
                closeSheet();
                toast("Time tracker updated");
                resolve(true);
              },
              onError: () => {
                toast("Failed to update time tracker");
                resolve(false);
              },
            }
          );
        });
      } else {
        await new Promise((resolve) => {
          createTracker(
            { ...data, userId },
            {
              onSuccess: () => {
                closeSheet();
                toast("Time tracker created");
                resolve(true);
              },
              onError: () => {
                toast("Failed to create time tracker");
                resolve(false);
              },
            }
          );
        });
      }
    } catch {
      toast(`Failed to ${isEditing ? "update" : "create"} time tracker`);
    }
  };

  const onCancel = () => {
    reset();
    closeSheet();
  };

  const isPending = isCreating || isUpdating || isLoading;

  if (isLoading) {
    return <div>Loading time tracker data...</div>;
  }

  if (isError) {
    return <div>Error loading time tracker data</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="flex items-center gap-2 text-sm leading-none select-none text-foreground font-medium group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                    Start Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      data-slot="input"
                      className="mt-2 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background border-border text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="flex items-center gap-2 text-sm leading-none select-none text-foreground font-medium group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                    Start Time
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="time"
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

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="flex items-center gap-2 text-sm leading-none select-none text-foreground font-medium group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                    End Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      data-slot="input"
                      className="mt-2 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background border-border text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="flex items-center gap-2 text-sm leading-none select-none text-foreground font-medium group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                    End Time
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="time"
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
        </div>

        <FormField
          control={form.control}
          name="hackathonTimezone"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="flex items-center gap-2 text-sm leading-none select-none text-foreground font-medium group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                Hackathon Timezone
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-2 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background border-border text-foreground">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {timezones.map((tz) => (
                      <SelectItem
                        key={tz}
                        value={tz}
                        className="text-foreground hover:bg-panel-bg"
                      >
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userTimezone"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="flex items-center gap-2 text-sm leading-none select-none text-foreground font-medium group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                User Timezone
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-2 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background border-border text-foreground">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {timezones.map((tz) => (
                      <SelectItem
                        key={tz}
                        value={tz}
                        className="text-foreground hover:bg-panel-bg"
                      >
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root?.message && (
          <div className="text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-end pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="border bg-background shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 border-border text-foreground hover:bg-panel-bg inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isPending}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs h-9 px-4 py-2 has-[>svg]:px-3 bg-accent-1 hover:bg-accent-1/90 text-foreground font-medium"
          >
            {isPending
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update"
              : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

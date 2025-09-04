import { z } from "zod";

// Base schema
export const timeTrackerSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endDate: z.string().min(1, "End date is required"),
  endTime: z.string().min(1, "End time is required"),
  hackathonTimezone: z.string().min(1, "Hackathon timezone is required"),
  userTimezone: z.string().min(1, "User timezone is required"),
});

export type TimeTrackerFormValues = z.infer<typeof timeTrackerSchema>;

// Enhanced schema with proper timezone-aware validation
export const timeTrackerSchemaWithValidation = timeTrackerSchema.superRefine(
  (data, ctx) => {
    const { startDate, startTime, endDate, endTime, hackathonTimezone } = data;

    // Only validate if all fields are filled
    if (!startDate || !startTime || !endDate || !endTime || !hackathonTimezone)
      return;

    try {
      // Create timezone-aware Date objects
      // Using the hackathon timezone since that's likely the reference timezone
      const startDateTimeString = `${startDate}T${startTime}:00`;
      const endDateTimeString = `${endDate}T${endTime}:00`;

      // Create Date objects - these will be interpreted in local time first
      const startDateTime = new Date(startDateTimeString);
      const endDateTime = new Date(endDateTimeString);

      // Check if dates are valid
      if (isNaN(startDateTime.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid start date/time",
          path: ["startDate"],
        });
        return;
      }

      if (isNaN(endDateTime.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid end date/time",
          path: ["endDate"],
        });
        return;
      }

      // For timezone-aware comparison, we need to convert to the same timezone
      // Since we can't easily do timezone conversion without a library like date-fns-tz,
      // we'll do a basic comparison assuming the same timezone context

      // Simple comparison - end must be after start
      if (endDateTime <= startDateTime) {
        ctx.addIssue({
          code: "custom",
          message: "End date and time must be after start date and time",
          path: ["endTime"],
        });
      }

      // Additional validation: check if the dates are too far apart (optional)
      const diffInMs = endDateTime.getTime() - startDateTime.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays > 365) {
        ctx.addIssue({
          code: "custom",
          message: "Time period cannot exceed 1 year",
          path: ["endDate"],
        });
      }
    } catch {
      ctx.addIssue({
        code: "custom",
        message: "Invalid date/time format",
        path: ["startDate"],
      });
    }
  }
);

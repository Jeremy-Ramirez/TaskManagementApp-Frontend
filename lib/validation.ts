import { z } from "zod";
import { TaskStatus } from "@/types/task";

export const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  status: z.nativeEnum(TaskStatus, {
    message: "You must select a valid status",
  }),
});

export const validateTask = (data: unknown) => {
  const result = taskSchema.safeParse(data);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        fieldErrors[issue.path[0].toString()] = issue.message;
      }
    });
    return { isValid: false, errors: fieldErrors };
  }
  return { isValid: true, errors: {} };
};

import { z } from 'zod';

/**
 * Validation for the create/edit task form.
 *
 * Keeping this in one place means the validation rules and the TypeScript
 * type for the form (`TaskFormValues`, below) can never drift apart — the
 * type is *inferred* from the schema instead of hand-written twice.
 */
export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(120, 'Title must be 120 characters or fewer.'),
  notes: z
    .string()
    .trim()
    .max(500, 'Notes must be 500 characters or fewer.')
    .optional()
    .or(z.literal('')),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

import { z } from "zod";

export const searchInputSchema = z.object({
  topic: z.string().min(3, 'Topic must have at least 3 characters.').max(100, 'Topic must be at most 100 characters.'),
});

// Infer the TypeScript from the schema
export type SearchInput = z.infer<typeof searchInputSchema>;
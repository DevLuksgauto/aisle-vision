import { z } from 'zod';

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type ListUsersQueryDto = z.infer<typeof listUsersQuerySchema>;

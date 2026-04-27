import { z } from 'zod';

export const userIdSchema = z.object({
  id: z.uuid(),
});

export type UserIdDto = z.infer<typeof userIdSchema>;

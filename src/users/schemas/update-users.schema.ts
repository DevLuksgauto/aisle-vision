import { z } from 'zod';

export const updateUserSchema = z.object({
  email: z.email().optional(),
  password: z.string().min(6).optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

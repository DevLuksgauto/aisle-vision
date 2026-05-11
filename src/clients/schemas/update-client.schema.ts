import { z } from 'zod';

export const updateClientSchema = z.object({
  code: z.string().min(1).optional(),
  corporateName: z.string().min(2).optional(),
  fantasyName: z.string().optional(),
  area: z.string().optional(),
  collections: z.string().optional(),
});

export type UpdateClientDto = z.infer<typeof updateClientSchema>;

import { z } from 'zod';

export const createClientSchema = z.object({
  code: z.string().min(1),
  corporateName: z.string().min(2),
  fantasyName: z.string().optional(),
  area: z.string().optional(),
  collections: z.string().optional(),
});

export type CreateClientDto = z.infer<typeof createClientSchema>;

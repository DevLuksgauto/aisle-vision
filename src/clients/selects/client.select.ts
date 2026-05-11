import { Prisma } from '@prisma/client';

export const clientSelect = {
  id: true,
  code: true,
  corporateName: true,
  fantasyName: true,
  area: true,
  collections: true,
  createdAt: true,
} satisfies Prisma.ClientSelect;

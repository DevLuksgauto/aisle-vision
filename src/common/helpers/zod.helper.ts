import type z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

export const ZodPipe = <T>(schema: z.ZodType<T>) =>
  new ZodValidationPipe(schema);

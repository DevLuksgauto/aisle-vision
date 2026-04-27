import { BadRequestException, type PipeTransform } from '@nestjs/common';
import { z } from 'zod';

export class ZodValidationPipe<T = unknown> implements PipeTransform {
  constructor(private schema: z.ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const formatted = z.treeifyError(result.error);
      throw new BadRequestException(formatted);
    }

    return result.data;
  }
}

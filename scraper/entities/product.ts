import { z } from 'zod';

export const productSchema = z.object({
  title: z.string(),
  price: z.number().nullable(),
  rate: z.number().nullable(),
  url: z.string(),
  date: z.string(),
});

export type Product = z.infer<typeof productSchema>;

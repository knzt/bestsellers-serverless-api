import { z } from 'zod';

export const productSchema = z.object({
  title: z.string(),
  price: z.string(),
  rate: z.string(),
  url: z.string(),
});

export type Product = z.infer<typeof productSchema>;

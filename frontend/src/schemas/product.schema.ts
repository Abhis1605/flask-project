import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters."),

  price: z
    .number({ error: "Price is required." })
    .gt(0, "Price must be greater than 0."),

  quantity: z
    .number({ error: "Quantity is required." })
    .int("Quantity must be a whole number.")
    .min(0, "Quantity cannot be negative."),

  category: z
    .number({ error: "Category is required." })
    .min(1, "Category is required."),
});

export type ProductSchema = z.infer<typeof productSchema>;

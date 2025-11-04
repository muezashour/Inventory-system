"use server";

import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";
import z from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().nonnegative("Price must be non-negativel"),
  quantity: z.coerce.number().int().min(0, "Quantity must be non-negative"),
  sku: z.string().optional(),
  lowStockAt: z.coerce.number().int().min(0).optional(),
});

export async function deleteProduct(formData: FormData) {
  const user = await getCurrentUser();
    const id = String(formData.get("id") || "");

  await prisma.product.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });
}
export async function CreatProduct(formData: FormData) {
  const user = await getCurrentUser();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    sku: formData.get("sku") || undefined,
    lowStockAt: formData.get("LowstoclAtm") || undefined,
  });
  if (!parsed.success) {
    throw new Error("Invalid form data");
  }
  try {
      await prisma.product.create({ data: { ...parsed.data, userId: user.id } });
      redirect("/inventory");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message?.includes("NEXT_REDIRECT")) throw error;
    console.log("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

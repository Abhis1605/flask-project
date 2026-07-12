"use client";

import { FormEvent, useEffect, useState } from "react";

import Modal from "@/components/ui/Modal";
import Label from "@/components/ui/Label";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useUpdateProductQuantity } from "@/hooks/useProducts";
import type { Product } from "@/types/product";

interface StockUpdateModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function StockUpdateModal({
  open,
  onClose,
  product,
}: StockUpdateModalProps) {
  const [operation, setOperation] = useState<"add" | "remove">("add");
  const [quantity, setQuantity] = useState("");

  const updateQuantity = useUpdateProductQuantity();

  useEffect(() => {
    if (open) {
      setOperation("add");
      setQuantity("");
    }
  }, [open]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!product) return;

    const parsedQuantity = Number(quantity);

    if (!parsedQuantity || parsedQuantity <= 0) return;

    updateQuantity.mutate(
      { id: product.id, data: { operation, quantity: parsedQuantity } },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <Modal open={open} onClose={onClose} title="Update Stock">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {product?.name} — current quantity: {product?.quantity ?? 0}
        </p>

        <div>
          <Label>Operation</Label>
          <Select
            value={operation}
            onChange={(e) => setOperation(e.target.value as "add" | "remove")}
          >
            <option value="add">Add stock</option>
            <option value="remove">Remove stock</option>
          </Select>
        </div>

        <div>
          <Label>Quantity</Label>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" loading={updateQuantity.isPending}>
            Update Stock
          </Button>
        </div>
      </form>
    </Modal>
  );
}

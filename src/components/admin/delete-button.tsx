"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions/admin";

export function DeleteProductButton({ id, label, confirmText }: { id: string; label: string; confirmText: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn border border-red-200 bg-white text-red-700 hover:bg-red-50">
        <Trash2 className="size-4" />
        {label}
      </button>
    </form>
  );
}

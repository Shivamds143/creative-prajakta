"use client";

type BadgeVariant = "bestseller" | "new" | "sale" | "limited" | "custom";

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  bestseller: "bg-gold text-wine",
  new: "bg-blue-500 text-white",
  sale: "bg-red-500 text-white",
  limited: "bg-burgundy text-white",
  custom: "bg-ink text-ivory",
};

const DEFAULT_LABELS: Record<BadgeVariant, string> = {
  bestseller: "Bestseller",
  new: "New",
  sale: "Sale",
  limited: "Limited",
  custom: "Custom",
};

export default function Badge({ variant, label }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${VARIANT_STYLES[variant]}`}
    >
      {label ?? DEFAULT_LABELS[variant]}
    </span>
  );
}

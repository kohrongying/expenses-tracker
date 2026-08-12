import { cn } from "@/lib/utils";
import type { Category } from "@/types";

const SIZE_CLASSES = {
  sm: "h-[26px] w-[26px] rounded-[5px]",
  md: "h-[30px] w-[30px] rounded-md",
  lg: "h-[34px] w-[34px] rounded-md",
};

const ICON_SIZE = { sm: 13, md: 15, lg: 17 };

interface CategoryStampProps {
  category: Category;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

// Tinted square chip for a category: a flat-color square swatch would fail
// the palette's contrast check on the light surface, so the icon (tinted to
// the full category color) carries identity and the fill is just a wash.
const CategoryStamp = ({
  category,
  size = "md",
  className,
}: CategoryStampProps) => {
  const Icon = category.icon;

  return (
    <span
      className={cn(
        "inline-flex flex-shrink-0 items-center justify-center border border-black/10 dark:border-white/10",
        SIZE_CLASSES[size],
        className
      )}
      style={{
        backgroundColor: `color-mix(in oklab, ${category.color} 18%, transparent)`,
      }}
    >
      <Icon
        size={ICON_SIZE[size]}
        strokeWidth={2.25}
        style={{ color: category.color }}
      />
    </span>
  );
};

export default CategoryStamp;

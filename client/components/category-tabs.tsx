import { mockCategories } from "@/lib/mock-data";
import { Category } from "@/lib/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CategoryTabsProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryTabs({
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div className="bg-white sticky top-0 z-10 border-b border-gray-200">
      <ScrollArea className="w-full">
        <div className="flex gap-1 px-4 py-3">
          {mockCategories.map((category: Category) => (
            <button
              key={category.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelectCategory(category.id);
              }}
              type="button"
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg whitespace-nowrap transition-colors min-h-[80px] min-w-[80px] justify-center cursor-pointer ${
                selectedCategory === category.id
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-label={`Filtrar por ${category.name}`}
              aria-pressed={selectedCategory === category.id}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="text-xs font-medium">{category.name}</span>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

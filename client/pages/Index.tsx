import { useState, useMemo } from "react";
import { RestaurantHeader } from "@/components/restaurant-header";
import { CategoryTabs } from "@/components/category-tabs";
import { MenuItemCard } from "@/components/menu-item-card";
import { FloatingCartButton } from "@/components/floating-cart-button";
import { useRestaurant } from "@/lib/restaurant-context";

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState("appetizers");
  const { menuItems } = useRestaurant();

  const filteredItems = useMemo(
    () => menuItems.filter((item) => item.category === selectedCategory),
    [menuItems, selectedCategory]
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <RestaurantHeader />
      <CategoryTabs
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum item disponível nesta categoria</p>
          </div>
        )}
      </div>

      <FloatingCartButton />
    </div>
  );
}

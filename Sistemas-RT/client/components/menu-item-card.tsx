import { MenuItem } from "@/lib/types";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { ProductDetailModal } from "./product-detail-modal";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { items } = useCart();

  // Encontrar quantidade deste item no carrinho
  const cartItem = items.find((i) => i.id === item.id);
  const cartQuantity = cartItem?.quantity || 0;

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow food-card flex flex-col h-full cursor-pointer group"
      >
        <div className="relative overflow-hidden bg-gray-200 h-48">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/400x300?text=" +
                encodeURIComponent(item.name);
            }}
          />
          {!item.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Indisponível</span>
            </div>
          )}
          
          {/* Badge de quantidade no carrinho */}
          {cartQuantity > 0 && (
            <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
              {cartQuantity}
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-orange-500 transition-colors">
              {item.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {item.description}
            </p>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="text-xl font-bold text-orange-500">R$</span>
              <span className="text-2xl font-bold text-orange-500">
                {item.price.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Toque para mais detalhes</p>
          </div>
        </div>
      </div>

      <ProductDetailModal
        item={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

import { MenuItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { QuantitySelector } from "./quantity-selector";
import { useCart } from "@/lib/cart-context";
import { X } from "lucide-react";
import { toast } from "sonner";

interface ProductDetailModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({
  item,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  if (!isOpen) return null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (quantity > 0 && item.available) {
      setIsAdding(true);
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity,
        image: item.image,
      });

      toast.success(`${item.name} adicionado ao carrinho!`, {
        description: `Quantidade: ${quantity}`,
      });

      setQuantity(1);
      setTimeout(() => {
        setIsAdding(false);
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-xl animate-in slide-in-from-bottom-5 sm:fade-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product image */}
        <div className="relative w-full h-64 sm:h-72 bg-gray-200 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/400x300?text=" +
                encodeURIComponent(item.name);
            }}
          />
          {!item.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Indisponível</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {item.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-1 mb-4 whitespace-nowrap overflow-hidden text-ellipsis">
            <span className="text-3xl sm:text-4xl font-bold text-orange-500">
              R$ {item.price.toFixed(2)}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-600 mb-2 uppercase">
              Descrição
            </h2>
            <p className="text-gray-700 text-base leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Availability */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Status:</strong>{" "}
              {item.available ? (
                <span className="text-green-600 font-semibold">Disponível</span>
              ) : (
                <span className="text-red-600 font-semibold">Indisponível</span>
              )}
            </p>
          </div>

          {/* Quantity and Add to Cart */}
          {item.available && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Quantidade
                </label>
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="h-12 text-gray-900 border-gray-300 hover:bg-gray-50"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleAddToCart}
                  className={`h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all ${
                    isAdding ? "scale-95 bg-green-500" : ""
                  }`}
                  disabled={!item.available}
                >
                  {isAdding ? "✓ Adicionado" : "Adicionar ao Carrinho"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      <div
        className="fixed inset-0 -z-10 bg-black/50"
        onClick={onClose}
      />
    </div>
  );
}

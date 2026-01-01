import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
}: QuantitySelectorProps) {
  const handleMinus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuantityChange(Math.max(1, quantity - 1));
  };

  const handlePlus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuantityChange(quantity + 1);
  };

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <button
        type="button"
        onClick={handleMinus}
        className="h-8 w-8 p-0 hover:bg-gray-200 rounded flex items-center justify-center transition-colors min-h-[32px] min-w-[32px]"
        aria-label="Diminuir quantidade"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-6 text-center font-semibold text-sm">{quantity}</span>
      <button
        type="button"
        onClick={handlePlus}
        className="h-8 w-8 p-0 hover:bg-gray-200 rounded flex items-center justify-center transition-colors min-h-[32px] min-w-[32px]"
        aria-label="Aumentar quantidade"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

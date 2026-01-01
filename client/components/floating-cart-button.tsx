import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Link } from "react-router-dom";

export function FloatingCartButton() {
  const { items, getTotalPrice } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = getTotalPrice();

  if (itemCount === 0) {
    return null;
  }

  return (
    <Link
      to="/order"
      className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center w-16 h-16 md:w-20 md:h-20 min-h-[64px] min-w-[64px]"
    >
      <div className="flex flex-col items-center justify-center">
        <ShoppingBag className="w-6 h-6 md:w-7 md:h-7" />
        <div className="flex flex-col items-center">
          <span className="text-xs md:text-sm font-bold">{itemCount}</span>
          <span className="text-xs font-semibold">${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}

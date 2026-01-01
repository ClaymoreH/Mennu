import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { useRestaurant } from "@/lib/restaurant-context";

export function RestaurantHeader() {
  const { restaurant } = useRestaurant();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 text-center">
            <div className="text-5xl mb-3">{restaurant.logo}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {restaurant.name}
            </h1>
            <p className="text-gray-600 text-sm">{restaurant.tagline}</p>
          </div>
          <Link
            to="/admin"
            className="mt-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Painel do Administrador"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

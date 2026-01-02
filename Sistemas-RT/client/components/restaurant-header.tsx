import { useRestaurant } from "@/lib/restaurant-context";

export function RestaurantHeader() {
  const { restaurant } = useRestaurant();

  // Verificar se logo é uma imagem (base64) ou emoji
  const isImage = restaurant.logo.startsWith("data:");

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-start justify-center">
          <div className="flex-1 text-center">
            {isImage ? (
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-20 h-20 mx-auto mb-3 object-contain"
              />
            ) : (
              <div className="text-5xl mb-3">{restaurant.logo}</div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {restaurant.name}
            </h1>
            <p className="text-gray-600 text-sm">{restaurant.tagline}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

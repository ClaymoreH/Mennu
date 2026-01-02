import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useRestaurant } from "@/lib/restaurant-context";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, ArrowLeft } from "lucide-react";
import { QuantitySelector } from "@/components/quantity-selector";

export default function OrderPage() {
  const { items, getTotalPrice, updateQuantity, removeItem, clearCart } =
    useCart();
  const { restaurant } = useRestaurant();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Seu carrinho está vazio
          </h1>
          <p className="text-gray-600 mb-6">
            Comece adicionando itens do cardápio
          </p>
          <Link to="/">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Voltar ao Cardápio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSendOrder = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!customerName.trim()) {
      alert("Por favor, informe seu nome");
      return;
    }

    setIsSubmitting(true);

    const itemList = items
      .map(
        (item) =>
          `• ${item.name} x${item.quantity} - R$${(item.price * item.quantity).toFixed(2)}`
      )
      .join("\n");

    const message = `Olá! Gostaria de fazer um pedido:\n\n${itemList}\n\n*Total:* R$${totalPrice.toFixed(2)}\n\n*Cliente:* ${customerName}${customerNotes ? `\n*Observações:* ${customerNotes}` : ""}`;

    const encodedMessage = encodeURIComponent(message);

    // Tentar abrir WhatsApp Web (funciona melhor em desktop)
    const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${restaurant.whatsappNumber}&text=${encodedMessage}`;

    // Fallback para wa.me
    const whatsappAppUrl = `https://wa.me/${restaurant.whatsappNumber}?text=${encodedMessage}`;

    // Tentar abrir a URL
    try {
      // Primeiro tentar WhatsApp app (melhor para mobile)
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const urlToOpen = isMobile ? whatsappAppUrl : whatsappWebUrl;

      const windowReference = window.open(urlToOpen, "_blank");

      // Se conseguiu abrir, limpar carrinho após alguns segundos
      setTimeout(() => {
        if (windowReference) {
          clearCart();
          navigate("/");
        }
        setIsSubmitting(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao abrir WhatsApp:", error);
      alert("Não foi possível abrir o WhatsApp. Tente novamente ou copie manualmente a mensagem.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="px-2 hover:bg-gray-100 min-h-[44px] min-w-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Resumo do Pedido</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {/* Items List */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Itens</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/100?text=" +
                      encodeURIComponent(item.name);
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    R$ {item.price.toFixed(2)} cada
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <QuantitySelector
                    quantity={item.quantity}
                    onQuantityChange={(quantity) =>
                      updateQuantity(item.id, quantity)
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="px-2 hover:bg-red-100 text-red-600 min-h-[44px] min-w-[44px]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <span className="font-semibold text-gray-900 w-20 text-right">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Suas Informações
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="customer-name" className="block text-sm font-semibold text-gray-900 mb-2">
                Nome Completo *
              </label>
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Informe seu nome"
                className="h-12 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div>
              <label htmlFor="customer-notes" className="block text-sm font-semibold text-gray-900 mb-2">
                Observações (opcional)
              </label>
              <Textarea
                id="customer-notes"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Ex: Sem cebola, com mais sal, etc."
                className="rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>R$ {totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            <strong>Nota:</strong> Seu pedido será enviado via WhatsApp e o restaurante irá confirmá-lo em breve.
          </p>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Link to="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-12 text-gray-900 border-gray-300 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Editar Pedido
            </Button>
          </Link>
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSendOrder(e)}
            type="button"
            className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white font-semibold"
            disabled={isSubmitting || !customerName.trim()}
          >
            {isSubmitting ? "Enviando..." : "Enviar via WhatsApp"}
          </Button>
        </div>
      </div>
    </div>
  );
}

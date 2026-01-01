import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Edit2 } from "lucide-react";

const DEFAULT_ADMIN_PASSWORD = "admin123";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Lula à Milanesa",
      description: "Lula frita crocante",
      price: 12.99,
      category: "appetizers",
    },
  ]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "appetizers",
  });
  const [whatsappNumber, setWhatsappNumber] = useState("5511999999999");
  const [restaurantName, setRestaurantName] = useState("Taste Haven");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === DEFAULT_ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setPassword("");
    } else {
      alert("Senha inválida");
    }
  };

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newItem.name && newItem.price) {
      const item: MenuItem = {
        id: Date.now().toString(),
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price),
        category: newItem.category,
      };
      setMenuItems([...menuItems, item]);
      setNewItem({ name: "", description: "", price: "", category: "appetizers" });
      setIsAddingItem(false);
    }
  };

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Acesso Admin
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Gerencie seu cardápio
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Senha
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Informe a senha de administrador"
                className="h-12 rounded-lg"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                Senha de demonstração: admin123
              </p>
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            >
              Entrar
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="px-2 hover:bg-gray-100 min-h-[44px] min-w-[44px]"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
          </div>
          <Button
            onClick={() => setIsLoggedIn(false)}
            variant="outline"
            className="text-gray-600 border-gray-300"
          >
            Sair
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Restaurant Settings */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Configurações do Restaurante
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome do Restaurante
              </label>
              <Input
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="h-12 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Número do WhatsApp (com código do país)
              </label>
              <Input
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Ex: 5511999999999"
                className="h-12 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-2">
                Exemplo: 5511999999999 (código do Brasil + DDD + número)
              </p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Salvar Configurações
            </Button>
          </div>
        </div>

        {/* Menu Management */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Itens do Cardápio</h2>
            <Button
              onClick={() => setIsAddingItem(!isAddingItem)}
              className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Item
            </Button>
          </div>

          {/* Add Item Form */}
          {isAddingItem && (
            <form
              onSubmit={handleAddItem}
              className="bg-gray-50 rounded-lg p-4 mb-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nome do Item
                  </label>
                  <Input
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    placeholder="Ex: Lula à Milanesa"
                    className="h-10 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Preço
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem({ ...newItem, price: e.target.value })
                    }
                    placeholder="0.00"
                    className="h-10 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Descrição
                </label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  placeholder="Descrição do item"
                  className="rounded-lg resize-none"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Categoria
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-gray-300"
                >
                  <option value="appetizers">Entradas</option>
                  <option value="mains">Pratos Principais</option>
                  <option value="pasta">Massas</option>
                  <option value="desserts">Sobremesas</option>
                  <option value="beverages">Bebidas</option>
                </select>
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  Adicionar Item
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          {/* Items List */}
          <div className="space-y-3">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-gray-600">
                      R$ {item.price.toFixed(2)}
                    </span>
                    <span className="text-gray-500">{item.category}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:bg-blue-100 min-h-[44px] min-w-[44px]"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleDeleteItem(e, item.id)}
                    className="text-red-600 hover:bg-red-100 min-h-[44px] min-w-[44px]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

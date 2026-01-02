import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, LogOut } from "lucide-react";
import { useRestaurant } from "@/lib/restaurant-context";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { MenuItem } from "@/lib/types";
const MAX_LOGO_SIZE = 500 * 1024; // 500KB em bytes
const MAX_LOGO_PIXELS = 200; // 200x200 máximo

// Função para comprimir imagem
const compressImage = (imageData: string, maxWidth = 200, maxHeight = 200, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageData;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Redimensionar mantendo aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      const compressedData = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedData);
    };
  });
};

interface ItemFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  available: boolean;
}

const EMPTY_ITEM_FORM: ItemFormData = {
  name: "",
  description: "",
  price: "",
  category: "appetizers",
  image: "",
  available: true,
};

const CATEGORIES = [
  { id: "appetizers", name: "Entradas" },
  { id: "mains", name: "Pratos Principais" },
  { id: "pasta", name: "Massas" },
  { id: "desserts", name: "Sobremesas" },
  { id: "beverages", name: "Bebidas" },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { restaurant, menuItems, updateRestaurant, addMenuItem, deleteMenuItem, updateMenuItem } = useRestaurant();

  const [selectedCategory, setSelectedCategory] = useState("appetizers");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState<ItemFormData>(EMPTY_ITEM_FORM);
  const [tempRestaurant, setTempRestaurant] = useState({
    name: restaurant.name,
    whatsappNumber: restaurant.whatsappNumber,
    logo: restaurant.logo,
    tagline: restaurant.tagline,
  });

  // Atualizar tempRestaurant quando restaurant muda
  useEffect(() => {
    setTempRestaurant({
      name: restaurant.name,
      whatsappNumber: restaurant.whatsappNumber,
      logo: restaurant.logo,
      tagline: restaurant.tagline,
    });
  }, [restaurant]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout realizado com sucesso!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer logout");
    }
  };

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!itemForm.name || !itemForm.price) {
      toast.error("Nome e preço são obrigatórios");
      return;
    }

    const item: MenuItem = {
      id: Date.now().toString(),
      name: itemForm.name,
      description: itemForm.description,
      price: parseFloat(itemForm.price),
      category: itemForm.category,
      image: itemForm.image || "https://via.placeholder.com/400x300?text=Sem+Imagem",
      available: itemForm.available,
    };
    
    addMenuItem(item);
    setItemForm(EMPTY_ITEM_FORM);
    setIsEditModalOpen(false);
    toast.success("Produto adicionado com sucesso!");
  };

  const handleUpdateItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!itemForm.name || !itemForm.price) {
      toast.error("Nome e preço são obrigatórios");
      return;
    }

    if (!editingId) return;

    updateMenuItem(editingId, {
      name: itemForm.name,
      description: itemForm.description,
      price: parseFloat(itemForm.price),
      category: itemForm.category,
      image: itemForm.image,
      available: itemForm.available,
    });
    
    setItemForm(EMPTY_ITEM_FORM);
    setEditingId(null);
    setIsEditModalOpen(false);
    toast.success("Produto atualizado com sucesso!");
  };

  const handleStartEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      available: item.available,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingId(null);
    setItemForm(EMPTY_ITEM_FORM);
    setIsEditModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    deleteMenuItem(id);
    toast.success("Produto removido com sucesso!");
  };

  const handleSaveSettings = () => {
    if (!tempRestaurant.name || !tempRestaurant.whatsappNumber) {
      toast.error("Nome do restaurante e WhatsApp são obrigatórios");
      return;
    }
    updateRestaurant({
      name: tempRestaurant.name,
      whatsappNumber: tempRestaurant.whatsappNumber,
      logo: tempRestaurant.logo,
      tagline: tempRestaurant.tagline,
    });
    toast.success("Configurações salvas com sucesso!");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_LOGO_SIZE) {
        toast.error(`Imagem muito grande. Máximo: ${MAX_LOGO_SIZE / 1024 / 1024}MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const result = event.target?.result as string;
          // Comprimir a imagem do produto para economizar espaço
          const compressed = await compressImage(result, 400, 400, 0.8);
          setItemForm({ ...itemForm, image: compressed });
        } catch (error) {
          toast.error("Erro ao processar imagem");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_LOGO_SIZE) {
        toast.error(`Logo muito grande. Máximo: ${MAX_LOGO_SIZE / 1024 / 1024}MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const result = event.target?.result as string;
          // Validar tamanho da imagem e comprimir
          const img = new Image();
          img.onload = async () => {
            if (img.width > MAX_LOGO_PIXELS || img.height > MAX_LOGO_PIXELS) {
              toast.error(`Logo muito grande. Máximo: ${MAX_LOGO_PIXELS}x${MAX_LOGO_PIXELS}px`);
              return;
            }
            // Comprimir a imagem antes de salvar
            const compressed = await compressImage(result, MAX_LOGO_PIXELS, MAX_LOGO_PIXELS, 0.8);
            setTempRestaurant({ ...tempRestaurant, logo: compressed });
            toast.success("Logo carregado e comprimido com sucesso!");
          };
          img.src = result;
        } catch (error) {
          toast.error("Erro ao processar logo");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredItems = menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-gray-600 border-gray-300 gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Restaurant Settings */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Configurações do Restaurante
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="restaurant-name" className="block text-sm font-semibold text-gray-900 mb-2">
                Nome do Restaurante
              </label>
              <Input
                id="restaurant-name"
                value={tempRestaurant.name}
                onChange={(e) => setTempRestaurant({ ...tempRestaurant, name: e.target.value })}
                className="h-12 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="whatsapp-number" className="block text-sm font-semibold text-gray-900 mb-2">
                Número do WhatsApp (com código do país)
              </label>
              <Input
                id="whatsapp-number"
                value={tempRestaurant.whatsappNumber}
                onChange={(e) => setTempRestaurant({ ...tempRestaurant, whatsappNumber: e.target.value })}
                placeholder="Ex: 5511999999999"
                className="h-12 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="restaurant-tagline" className="block text-sm font-semibold text-gray-900 mb-2">
                Tagline (mini frase do negócio)
              </label>
              <Textarea
                id="restaurant-tagline"
                value={tempRestaurant.tagline}
                onChange={(e) => setTempRestaurant({ ...tempRestaurant, tagline: e.target.value })}
                placeholder="Ex: Sabores Autênticos, Ingredientes Frescos"
                className="rounded-lg resize-none"
                rows={2}
              />
            </div>
            <div>
              <label htmlFor="restaurant-logo" className="block text-sm font-semibold text-gray-900 mb-2">
                Logo (emoji ou imagem)
              </label>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input
                    id="restaurant-logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="h-12 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Máx: {MAX_LOGO_PIXELS}x{MAX_LOGO_PIXELS}px, {MAX_LOGO_SIZE / 1024 / 1024}MB
                  </p>
                </div>
                {tempRestaurant.logo && !tempRestaurant.logo.startsWith("data:") && (
                  <div className="flex-shrink-0 text-5xl">{tempRestaurant.logo}</div>
                )}
                {tempRestaurant.logo && tempRestaurant.logo.startsWith("data:") && (
                  <img
                    src={tempRestaurant.logo}
                    alt="Logo preview"
                    className="w-16 h-16 object-contain flex-shrink-0"
                  />
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={handleSaveSettings}
            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Configurações
          </Button>
        </div>

        {/* Menu Management */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Itens do Cardápio</h2>
            <Button
              onClick={() => {
                setEditingId(null);
                setItemForm(EMPTY_ITEM_FORM);
                setIsEditModalOpen(true);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Item
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="border-b border-gray-200 mb-6 overflow-x-auto">
            <div className="flex gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 font-semibold text-sm whitespace-nowrap transition-colors border-b-2 ${
                    selectedCategory === cat.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        item.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.available ? "Disponível" : "Indisponível"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-gray-600 font-semibold">
                      R$ {item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStartEdit(item)}
                    className="text-blue-600 hover:bg-blue-100 min-h-[44px] min-w-[44px]"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-600 hover:bg-red-100 min-h-[44px] min-w-[44px]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhum item nesta categoria</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-lg">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? "Editar Produto" : "Adicionar Produto"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={editingId ? handleUpdateItem : handleAddItem}
              className="p-6 space-y-4"
            >
              <div>
                <label htmlFor="modal-item-name" className="block text-sm font-semibold text-gray-900 mb-2">
                  Nome do Item
                </label>
                <Input
                  id="modal-item-name"
                  value={itemForm.name}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, name: e.target.value })
                  }
                  placeholder="Ex: Lula à Milanesa"
                  className="h-10 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="modal-item-price" className="block text-sm font-semibold text-gray-900 mb-2">
                    Preço
                  </label>
                  <Input
                    id="modal-item-price"
                    type="number"
                    step="0.01"
                    value={itemForm.price}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, price: e.target.value })
                    }
                    placeholder="0.00"
                    className="h-10 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="modal-item-category" className="block text-sm font-semibold text-gray-900 mb-2">
                    Categoria
                  </label>
                  <select
                    id="modal-item-category"
                    value={itemForm.category}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, category: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-gray-300"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="modal-item-description" className="block text-sm font-semibold text-gray-900 mb-2">
                  Descrição
                </label>
                <Textarea
                  id="modal-item-description"
                  value={itemForm.description}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, description: e.target.value })
                  }
                  placeholder="Descrição do item"
                  className="rounded-lg resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label htmlFor="modal-item-image" className="block text-sm font-semibold text-gray-900 mb-2">
                  Foto do Produto
                </label>
                <Input
                  id="modal-item-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="h-10 rounded-lg"
                />
                {itemForm.image && (
                  <div className="mt-3 relative w-32 h-32">
                    <img
                      src={itemForm.image}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  id="modal-item-available"
                  type="checkbox"
                  checked={itemForm.available}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, available: e.target.checked })
                  }
                  className="w-5 h-5 rounded cursor-pointer"
                />
                <label
                  htmlFor="modal-item-available"
                  className="text-sm font-semibold text-gray-900 cursor-pointer"
                >
                  Produto disponível
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  onClick={handleCloseModal}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? "Atualizar" : "Adicionar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

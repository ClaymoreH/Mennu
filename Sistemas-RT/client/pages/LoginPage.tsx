import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { LogIn, UserPlus, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    restaurantName: "",
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success("Login realizado com sucesso!");
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.restaurantName) {
      toast.error("Nome do restaurante é obrigatório");
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData.email, formData.password, formData.restaurantName);
      toast.success("Conta criada com sucesso! Faça login para acessar.");
      setIsSignup(false);
      setFormData({ email: "", password: "", restaurantName: "" });
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col items-center justify-center px-4 py-8">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Cardápio
          </Button>
        </Link>
      </div>

      {/* Logo / Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🍽️</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Painel de Administração
        </h1>
        <p className="text-gray-600 text-lg">
          Gerencie seu cardápio e pedidos
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => {
              setIsSignup(false);
              setFormData({ email: "", password: "", restaurantName: "" });
            }}
            className={`flex-1 py-3 font-semibold text-center rounded-lg transition-all ${
              !isSignup
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <LogIn className="w-4 h-4 inline mr-2" />
            Entrar
          </button>
          <button
            onClick={() => {
              setIsSignup(true);
              setFormData({ email: "", password: "", restaurantName: "" });
            }}
            className={`flex-1 py-3 font-semibold text-center rounded-lg transition-all ${
              isSignup
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Registrar
          </button>
        </div>

        <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
          {isSignup && (
            <div>
              <label htmlFor="restaurant-name" className="block text-sm font-semibold text-gray-900 mb-2">
                Nome do Restaurante
              </label>
              <Input
                id="restaurant-name"
                type="text"
                value={formData.restaurantName}
                onChange={(e) =>
                  setFormData({ ...formData, restaurantName: e.target.value })
                }
                placeholder="Ex: Taste Haven"
                className="h-12 rounded-lg"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="seu@email.com"
              className="h-12 rounded-lg"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              className="h-12 rounded-lg"
              required
              minLength={6}
            />
            {isSignup && (
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 6 caracteres
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all"
          >
            {isLoading ? "Carregando..." : isSignup ? "Criar Conta" : "Entrar"}
          </Button>
        </form>

        {/* Demo Info */}
        {!isSignup && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-900">
              <strong>Demo:</strong> Use qualquer email e senha (mín. 6 caracteres) para testar
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-gray-600 text-sm mt-8 text-center">
        Acesso restrito a administradores.<br />
        Para suporte, entre em contato conosco.
      </p>
    </div>
  );
}

import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Erro 404: Usuário tentou acessar a rota:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="text-7xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Página Não Encontrada</h1>
        <p className="text-gray-600 text-lg mb-8">
          Desculpe, a página que você procura não existe.
        </p>
        <Link to="/">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 h-12">
            Voltar ao Cardápio
          </Button>
        </Link>
      </div>
    </div>
  );
}

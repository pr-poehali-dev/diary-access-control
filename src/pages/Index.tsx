
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDiary } from "@/components/DiaryContext";

const Index = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, isSiteBlocked, login } = useDiary();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/diary");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    setTimeout(() => {
      const success = login(password);
      setIsLoading(false);
      
      if (!success) {
        setError(isSiteBlocked 
          ? "Сайт заблокирован. Дневник уже был использован." 
          : "Неверный пароль. Пожалуйста, попробуйте снова.");
      }
    }, 500);
  };

  if (isSiteBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="border-2 border-gray-400 p-6 bg-gray-100 max-w-md">
          <h1 className="text-center text-2xl font-bold mb-4">Доступ закрыт</h1>
          <hr className="border-gray-400 mb-4" />
          <p className="text-center mb-4">
            Этот дневник уже был использован и заблокирован от повторного доступа.
          </p>
          <p className="text-center text-sm text-gray-600">
            Дневник может быть открыт только один раз.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="border-2 border-gray-400 p-6 bg-gray-100 max-w-md">
        <h1 className="text-center text-2xl font-bold mb-2">Мой Дневник</h1>
        <h2 className="text-center text-sm mb-4">Личные записи</h2>
        <hr className="border-gray-400 mb-4" />
        
        <div className="mb-4 text-center">
          <p>Введите пароль для доступа.</p>
          <p className="text-red-600 font-bold">
            Внимание: дневник можно открыть только один раз!
          </p>
        </div>
        
        {error && (
          <div className="border-2 border-red-500 bg-red-100 p-2 mb-4 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="flex flex-col items-center">
          <div className="mb-4 w-full">
            <label className="block mb-1">Пароль:</label>
            <input
              type="password"
              className="w-full border-2 border-gray-400 p-2 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="border-2 border-gray-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 w-32"
            disabled={isLoading}
          >
            {isLoading ? "Проверка..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Index;

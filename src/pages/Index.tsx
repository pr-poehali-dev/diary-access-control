
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDiary } from "@/components/DiaryContext";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, isSiteBlocked, register } = useDiary();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/diary");
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    setTimeout(() => {
      const success = register(email, password);
      setIsLoading(false);
      
      if (!success) {
        setError(" ");
      }
    }, 500);
  };

  if (isSiteBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="border-2 border-gray-400 p-6 bg-gray-100 max-w-md">
          <div className="border-2 border-red-500 bg-red-100 p-2 mb-4 text-center">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="border-2 border-gray-400 p-6 bg-gray-100 max-w-md">
        {error && (
          <div className="border-2 border-red-500 bg-red-100 p-2 mb-4 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleRegister} className="flex flex-col items-center">
          <div className="mb-4 w-full">
            <input
              type="email"
              className="w-full border-2 border-gray-400 p-2 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4 w-full">
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
            {isLoading ? "..." : "→"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Index;

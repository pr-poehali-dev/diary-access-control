
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDiary } from "@/components/DiaryContext";
import { LockKeyhole, BookOpen, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, isSiteBlocked, login } = useDiary();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/diary");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const success = login(password);
      setIsLoading(false);
      
      if (!success) {
        toast({
          title: "Доступ запрещен",
          description: isSiteBlocked 
            ? "Сайт заблокирован. Дневник уже был использован." 
            : "Неверный пароль. Пожалуйста, попробуйте снова.",
          variant: "destructive",
        });
      }
    }, 500); // Немного задержки для UI
  };

  if (isSiteBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100">
        <Card className="w-[350px] shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-destructive/10 p-3 rounded-full">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Доступ закрыт</CardTitle>
            <CardDescription>
              Этот дневник уже был использован и заблокирован от повторного доступа.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground text-center">
              Дневник может быть открыт только один раз.
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Мой Дневник</CardTitle>
          <CardDescription>
            Введите пароль для доступа. Внимание: дневник можно открыть только один раз!
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Введите пароль"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Проверка..." : "Войти"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Index;

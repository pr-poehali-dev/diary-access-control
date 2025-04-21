
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useDiary } from "@/components/DiaryContext";
import { PlusCircle, LogOut, Trash2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const DiaryPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { entries, addEntry, deleteEntry, isAuthenticated, logout } = useDiary();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      addEntry({
        title,
        content,
        date: new Date().toISOString(),
      });
      setTitle("");
      setContent("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy, HH:mm", { locale: ru });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Мой Дневник</h1>
          <div className="flex items-center gap-2">
            <Card className="p-2 bg-yellow-50 border-yellow-200">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <p className="text-xs font-medium">Одноразовый доступ</p>
              </div>
            </Card>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Новая запись</CardTitle>
            <CardDescription>Запишите свои мысли, чувства и события дня</CardDescription>
          </CardHeader>
          <form onSubmit={handleAddEntry}>
            <CardContent className="space-y-4">
              <Input
                placeholder="Заголовок записи"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Что у вас на уме сегодня?"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="ml-auto">
                <PlusCircle className="h-4 w-4 mr-2" />
                Сохранить запись
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Ваши записи</h2>
          
          {entries.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              У вас пока нет записей. Создайте свою первую запись в дневнике!
            </Card>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle>{entry.title}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteEntry(entry.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>{formatDate(entry.date)}</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4 whitespace-pre-wrap">
                  {entry.content}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryPage;

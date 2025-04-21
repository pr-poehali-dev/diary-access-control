
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDiary } from "@/components/DiaryContext";
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
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto border-2 border-gray-400 bg-gray-100 p-4">
        <header className="mb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Мой Дневник</h1>
            <div className="flex gap-2">
              <div className="border-2 border-red-500 bg-red-100 p-1 text-sm">
                Одноразовый доступ
              </div>
              <button 
                onClick={handleLogout}
                className="border-2 border-gray-700 bg-gray-200 hover:bg-gray-300 px-2 py-1"
              >
                Выйти
              </button>
            </div>
          </div>
          <hr className="border-gray-400 my-2" />
        </header>

        <div className="mb-6 border-2 border-gray-400 bg-white p-4">
          <h2 className="text-xl font-bold mb-2">Новая запись</h2>
          <form onSubmit={handleAddEntry}>
            <div className="mb-3">
              <label className="block mb-1">Заголовок:</label>
              <input
                className="w-full border-2 border-gray-400 p-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Содержание:</label>
              <textarea
                className="w-full border-2 border-gray-400 p-2"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="text-right">
              <button 
                type="submit" 
                className="border-2 border-gray-700 bg-gray-200 hover:bg-gray-300 px-4 py-2"
              >
                Сохранить запись
              </button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Ваши записи</h2>
          <hr className="border-gray-400 mb-4" />
          
          {entries.length === 0 ? (
            <div className="text-center p-4 border-2 border-gray-400 bg-white">
              У вас пока нет записей. Создайте свою первую запись в дневнике!
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="border-2 border-gray-400 bg-white">
                  <div className="bg-gray-200 p-2 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{entry.title}</h3>
                      <p className="text-sm">{formatDate(entry.date)}</p>
                    </div>
                    <button 
                      onClick={() => deleteEntry(entry.id)}
                      className="border-2 border-red-500 bg-red-100 hover:bg-red-200 px-2 py-1 text-sm"
                    >
                      Удалить
                    </button>
                  </div>
                  <div className="p-3 whitespace-pre-wrap">
                    {entry.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryPage;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDiary } from "@/components/DiaryContext";

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto border-2 border-gray-400 bg-gray-100 p-4">
        <header className="mb-4">
          <div className="flex justify-end">
            <button 
              onClick={handleLogout}
              className="border-2 border-gray-700 bg-gray-200 hover:bg-gray-300 px-2 py-1"
            >
              ×
            </button>
          </div>
          <hr className="border-gray-400 my-2" />
        </header>

        <div className="mb-6 border-2 border-gray-400 bg-white p-4">
          <form onSubmit={handleAddEntry}>
            <div className="mb-3">
              <input
                className="w-full border-2 border-gray-400 p-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
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
                +
              </button>
            </div>
          </form>
        </div>

        <div>
          {entries.length === 0 ? (
            <div className="text-center p-4 border-2 border-gray-400 bg-white">
              ...
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="border-2 border-gray-400 bg-white">
                  <div className="bg-gray-200 p-2 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{entry.title}</h3>
                      <p className="text-sm">{new Date(entry.date).toISOString()}</p>
                    </div>
                    <button 
                      onClick={() => deleteEntry(entry.id)}
                      className="border-2 border-red-500 bg-red-100 hover:bg-red-200 px-2 py-1 text-sm"
                    >
                      ×
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

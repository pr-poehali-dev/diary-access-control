
import { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface DiaryContextType {
  entries: DiaryEntry[];
  addEntry: (entry: Omit<DiaryEntry, "id">) => void;
  deleteEntry: (id: string) => void;
  isAuthenticated: boolean;
  isSiteBlocked: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

// В реальном приложении используйте безопасный хеш!
const CORRECT_PASSWORD = "12345"; // Это только для демо! В реальности используйте хеш + соль

export const DiaryProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSiteBlocked, setIsSiteBlocked] = useState(false);

  // Загружаем записи и проверяем блокировку при монтировании
  useEffect(() => {
    const savedEntries = localStorage.getItem("diaryEntries");
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error("Ошибка при загрузке записей дневника", error);
      }
    }
    
    // Проверяем статус аутентификации и блокировки
    const authStatus = localStorage.getItem("diaryAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }

    const blockStatus = localStorage.getItem("diarySiteBlocked");
    if (blockStatus === "true") {
      setIsSiteBlocked(true);
    }
  }, []);

  // Сохраняем записи при изменении
  useEffect(() => {
    localStorage.setItem("diaryEntries", JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: Omit<DiaryEntry, "id">) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setEntries([newEntry, ...entries]);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const login = (password: string) => {
    // Если сайт уже заблокирован после первого использования
    if (isSiteBlocked) {
      return false;
    }

    const success = password === CORRECT_PASSWORD;
    if (success) {
      setIsAuthenticated(true);
      localStorage.setItem("diaryAuth", "true");
      
      // Блокируем сайт после первого успешного входа
      setIsSiteBlocked(true);
      localStorage.setItem("diarySiteBlocked", "true");
    }
    return success;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("diaryAuth");
    // Не удаляем блокировку при выходе!
  };

  return (
    <DiaryContext.Provider
      value={{
        entries,
        addEntry,
        deleteEntry,
        isAuthenticated,
        isSiteBlocked,
        login,
        logout,
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (context === undefined) {
    throw new Error("useDiary must be used within a DiaryProvider");
  }
  return context;
};

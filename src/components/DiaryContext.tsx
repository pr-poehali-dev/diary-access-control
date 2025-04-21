
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
  register: (email: string, password: string) => boolean;
  logout: () => void;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

// For demonstration - in a real app this would be properly secured
const CORRECT_EMAIL = "user@example.com";
const CORRECT_PASSWORD = "12345";

export const DiaryProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSiteBlocked, setIsSiteBlocked] = useState(false);

  useEffect(() => {
    const savedEntries = localStorage.getItem("diaryEntries");
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error("Error loading diary entries", error);
      }
    }
    
    const authStatus = localStorage.getItem("diaryAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }

    const blockStatus = localStorage.getItem("diarySiteBlocked");
    if (blockStatus === "true") {
      setIsSiteBlocked(true);
    }
  }, []);

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

  const register = (email: string, password: string) => {
    if (isSiteBlocked) {
      return false;
    }

    // Very simple validation for demo
    const success = (email === CORRECT_EMAIL && password === CORRECT_PASSWORD) || 
                   (!localStorage.getItem("registeredEmail") && email.includes("@") && password.length >= 5);
    
    if (success) {
      setIsAuthenticated(true);
      localStorage.setItem("diaryAuth", "true");
      localStorage.setItem("registeredEmail", email);
      
      // Block the site after first successful login
      setIsSiteBlocked(true);
      localStorage.setItem("diarySiteBlocked", "true");
    }
    return success;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("diaryAuth");
    // Don't remove the block status when logging out!
  };

  return (
    <DiaryContext.Provider
      value={{
        entries,
        addEntry,
        deleteEntry,
        isAuthenticated,
        isSiteBlocked,
        register,
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

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import storage from "../utils/storage";
import strings from "../i18n/strings";

const STORAGE_KEY = "@refulink_language";
const DEFAULT_LANG = "en";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(DEFAULT_LANG);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    storage.getItem(STORAGE_KEY).then((saved) => {
      if (saved && strings[saved]) setLanguageState(saved);
      setLoaded(true);
    });
  }, []);

  const setLanguage = useCallback(async (lang) => {
    if (!strings[lang]) return;
    setLanguageState(lang);
    await storage.setItem(STORAGE_KEY, lang);
  }, []);

  const t = useCallback(
    (key) => strings[language]?.[key] ?? strings[DEFAULT_LANG]?.[key] ?? key,
    [language]
  );

  const isRTL = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, loaded }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

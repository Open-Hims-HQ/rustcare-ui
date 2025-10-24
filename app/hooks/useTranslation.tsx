import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { 
  translate, 
  loadTranslations, 
  preloadMultipleLanguages, 
  type TranslationDictionary 
} from "~/lib/i18n/translator";
import { getLanguage } from "~/lib/i18n/languages";

interface TranslationContextValue {
  /** Current language code */
  currentLanguage: string;
  /** Change the current language */
  setLanguage: (languageCode: string) => void;
  /** Translation function (synchronous, may return key if not loaded) */
  t: (key: string, variables?: Record<string, string>) => string;
  /** Check if translations are currently loading */
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextValue | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
  /** Initial language code */
  defaultLanguage?: string;
  /** Languages to preload on mount */
  preloadLanguages?: string[];
}

/**
 * Provider component that manages translation state.
 * Wrap your app with this provider to enable translations.
 * 
 * @example
 * ```tsx
 * <TranslationProvider defaultLanguage="en" preloadLanguages={["en", "es", "fr"]}>
 *   <App />
 * </TranslationProvider>
 * ```
 */
export function TranslationProvider({
  children,
  defaultLanguage = "en",
  preloadLanguages = ["en"],
}: TranslationProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [translations, setTranslations] = useState<TranslationDictionary>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load translations when language changes
  useEffect(() => {
    let isMounted = true;

    const loadLanguageTranslations = async () => {
      setIsLoading(true);
      try {
        const loaded = await loadTranslations(currentLanguage);
        if (isMounted) {
          setTranslations(loaded);
        }
      } catch (error) {
        console.error(`Failed to load translations for ${currentLanguage}:`, error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadLanguageTranslations();

    return () => {
      isMounted = false;
    };
  }, [currentLanguage]);

  // Preload specified languages on mount
  useEffect(() => {
    if (preloadLanguages.length > 0) {
      preloadMultipleLanguages(preloadLanguages).catch((error: unknown) => {
        console.error("Failed to preload translations:", error);
      });
    }
  }, [preloadLanguages]);

  // Synchronous translation function
  const t = useCallback(
    (key: string, variables?: Record<string, string>): string => {
      // Helper to get nested value
      const getNestedValue = (obj: TranslationDictionary, path: string): string | undefined => {
        const keys = path.split(".");
        let current: string | TranslationDictionary | undefined = obj;

        for (const key of keys) {
          if (typeof current === "object" && current !== null && key in current) {
            current = current[key];
          } else {
            return undefined;
          }
        }

        return typeof current === "string" ? current : undefined;
      };

      // Try to get translation
      let translation = getNestedValue(translations, key);

      // If not found and not loading, return the key itself
      if (!translation) {
        translation = key;
      }

      // Replace variables if provided
      if (variables && typeof translation === "string") {
        Object.entries(variables).forEach(([varKey, value]) => {
          translation = translation!.replace(new RegExp(`{{${varKey}}}`, "g"), value);
        });
      }

      return translation;
    },
    [translations]
  );

  const setLanguage = useCallback((languageCode: string) => {
    setCurrentLanguage(languageCode);
    
    // Store preference in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredLanguage", languageCode);
      
      // Update HTML attributes for proper language/direction support
      const lang = getLanguage(languageCode);
      if (lang) {
        document.documentElement.lang = languageCode;
        document.documentElement.dir = lang.rtl ? "rtl" : "ltr";
      }
    }
  }, []);

  const value: TranslationContextValue = {
    currentLanguage,
    setLanguage,
    t,
    isLoading,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

/**
 * Hook to access translation functions and language state.
 * Must be used within a TranslationProvider.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { t, currentLanguage, setLanguage } = useTranslation();
 *   
 *   return (
 *     <div>
 *       <h1>{t("common.welcome")}</h1>
 *       <p>{t("common.greeting", { name: "John" })}</p>
 *       <button onClick={() => setLanguage("es")}>
 *         {t("language.switchTo")}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTranslation() {
  const context = useContext(TranslationContext);
  
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  
  return context;
}

/**
 * Async translation function for server-side or async contexts.
 * Use this in loaders, actions, or when you need to ensure translations are loaded.
 * 
 * @example
 * ```tsx
 * export async function loader() {
 *   const welcomeMessage = await translateAsync("en", "common.welcome");
 *   return json({ welcomeMessage });
 * }
 * ```
 */
export async function translateAsync(
  languageCode: string,
  key: string,
  variables?: Record<string, string>
): Promise<string> {
  return translate(languageCode, key, variables);
}

/**
 * Simple hook for translation without context (for standalone use).
 * Loads translations on demand. Useful for simple cases.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { t, isLoading } = useSimpleTranslation("en");
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   
 *   return <h1>{t("common.welcome")}</h1>;
 * }
 * ```
 */
export function useSimpleTranslation(languageCode: string) {
  const [translations, setTranslations] = useState<TranslationDictionary>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTranslations = async () => {
      try {
        const loaded = await loadTranslations(languageCode);
        if (isMounted) {
          setTranslations(loaded);
        }
      } catch (error) {
        console.error(`Failed to load translations for ${languageCode}:`, error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTranslations();

    return () => {
      isMounted = false;
    };
  }, [languageCode]);

  const t = useCallback(
    (key: string, variables?: Record<string, string>): string => {
      const getNestedValue = (obj: TranslationDictionary, path: string): string | undefined => {
        const keys = path.split(".");
        let current: string | TranslationDictionary | undefined = obj;

        for (const key of keys) {
          if (typeof current === "object" && current !== null && key in current) {
            current = current[key];
          } else {
            return undefined;
          }
        }

        return typeof current === "string" ? current : undefined;
      };

      let translation = getNestedValue(translations, key) || key;

      if (variables) {
        Object.entries(variables).forEach(([varKey, value]) => {
          translation = translation.replace(new RegExp(`{{${varKey}}}`, "g"), value);
        });
      }

      return translation;
    },
    [translations]
  );

  return { t, isLoading };
}

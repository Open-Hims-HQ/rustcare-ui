/**
 * i18n Translation System with English Fallback
 * 
 * This system:
 * 1. Loads translations from language files
 * 2. Falls back to English if translation is missing
 * 3. Returns the key itself if English translation is also missing
 * 4. Supports nested translation keys (e.g., "common.save")
 */

import { WORLD_LANGUAGES, type Language } from "./languages"

// Translation dictionary type - using interface to allow recursive type
export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary
}

// Cache for loaded translations
const translationCache: Map<string, TranslationDictionary> = new Map()

// Default fallback language
const FALLBACK_LANGUAGE = "en"

/**
 * Load translations for a specific language
 * Returns empty object if file doesn't exist yet
 */
export async function loadTranslations(languageCode: string): Promise<TranslationDictionary> {
  // Check cache first
  if (translationCache.has(languageCode)) {
    return translationCache.get(languageCode)!
  }

  try {
    // Try to dynamically import the language file
    const translations = await import(`./translations/${languageCode}.json`)
    translationCache.set(languageCode, translations.default || translations)
    return translations.default || translations
  } catch (error) {
    console.warn(`Translation file for "${languageCode}" not found. Using fallback.`)
    // Return empty object if file doesn't exist
    translationCache.set(languageCode, {})
    return {}
  }
}

/**
 * Get nested value from object using dot notation
 * e.g., "common.buttons.save" => translations.common.buttons.save
 */
function getNestedValue(obj: any, path: string): string | undefined {
  const keys = path.split(".")
  let current = obj

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key]
    } else {
      return undefined
    }
  }

  return typeof current === "string" ? current : undefined
}

/**
 * Main translation function
 * 
 * @param key - Translation key (e.g., "common.save" or "dashboard.title")
 * @param languageCode - Current language code
 * @param variables - Optional variables to interpolate (e.g., {name: "John"})
 * @returns Translated string, or English fallback, or key itself
 */
export async function translate(
  key: string,
  languageCode: string = "en",
  variables?: Record<string, string | number>
): Promise<string> {
  // Load translations for requested language
  const translations = await loadTranslations(languageCode)
  
  // Try to get translation from requested language
  let result = getNestedValue(translations, key)
  
  // If not found and not already English, try English fallback
  if (!result && languageCode !== FALLBACK_LANGUAGE) {
    const fallbackTranslations = await loadTranslations(FALLBACK_LANGUAGE)
    result = getNestedValue(fallbackTranslations, key)
  }
  
  // If still not found, return the key itself as fallback
  if (!result) {
    console.warn(`Translation missing for key: "${key}" in languages: ${languageCode}, ${FALLBACK_LANGUAGE}`)
    result = key
  }
  
  // Interpolate variables if provided
  if (variables) {
    Object.entries(variables).forEach(([varKey, value]) => {
      result = result!.replace(new RegExp(`{{${varKey}}}`, "g"), String(value))
    })
  }
  
  return result
}

/**
 * Synchronous translation function (for client-side use)
 * Assumes translations are already loaded
 */
export function t(
  key: string,
  languageCode: string = "en",
  variables?: Record<string, string | number>
): string {
  // Get cached translations
  const translations = translationCache.get(languageCode) || {}
  
  // Try to get translation from requested language
  let result = getNestedValue(translations, key)
  
  // If not found and not already English, try English fallback
  if (!result && languageCode !== FALLBACK_LANGUAGE) {
    const fallbackTranslations = translationCache.get(FALLBACK_LANGUAGE) || {}
    result = getNestedValue(fallbackTranslations, key)
  }
  
  // If still not found, return the key itself as fallback
  if (!result) {
    result = key
  }
  
  // Interpolate variables if provided
  if (variables) {
    Object.entries(variables).forEach(([varKey, value]) => {
      result = result!.replace(new RegExp(`{{${varKey}}}`, "g"), String(value))
    })
  }
  
  return result
}

/**
 * Preload translations for a language
 * Useful for loading translations before they're needed
 */
export async function preloadTranslations(languageCode: string): Promise<void> {
  if (!translationCache.has(languageCode)) {
    await loadTranslations(languageCode)
  }
}

/**
 * Preload multiple languages
 */
export async function preloadMultipleLanguages(languageCodes: string[]): Promise<void> {
  await Promise.all(languageCodes.map(code => preloadTranslations(code)))
}

/**
 * Get translation completion percentage for a language
 * Compares against English (complete) translations
 */
export async function getTranslationCompleteness(languageCode: string): Promise<number> {
  if (languageCode === "en") return 100
  
  const translations = await loadTranslations(languageCode)
  const englishTranslations = await loadTranslations("en")
  
  const countKeys = (obj: any): number => {
    let count = 0
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        count++
      } else if (typeof obj[key] === "object") {
        count += countKeys(obj[key])
      }
    }
    return count
  }
  
  const translationCount = countKeys(translations)
  const englishCount = countKeys(englishTranslations)
  
  if (englishCount === 0) return 0
  
  return Math.round((translationCount / englishCount) * 100)
}

/**
 * Check if a specific key has translation
 */
export function hasTranslation(key: string, languageCode: string): boolean {
  const translations = translationCache.get(languageCode) || {}
  return getNestedValue(translations, key) !== undefined
}

/**
 * Clear translation cache (useful for hot-reloading in development)
 */
export function clearTranslationCache(): void {
  translationCache.clear()
}

/**
 * Get all available languages with translation status
 */
export async function getAvailableLanguagesWithStatus(): Promise<Array<Language & { completeness: number }>> {
  const results = await Promise.all(
    WORLD_LANGUAGES.map(async (lang) => {
      const completeness = await getTranslationCompleteness(lang.code)
      return {
        ...lang,
        completeness
      }
    })
  )
  
  return results
}

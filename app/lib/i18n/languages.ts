/**
 * Comprehensive list of world languages supported in the platform
 * Languages are organized by region and usage
 * Each language includes: code (ISO 639-1), name (English), nativeName, flag emoji, rtl (right-to-left)
 */

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  rtl?: boolean // Right-to-left languages
  region: string
}

export const WORLD_LANGUAGES: Language[] = [
  // Major Global Languages (Top 20 by speakers)
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", region: "Global" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "简体中文", flag: "🇨🇳", region: "Asia" },
  { code: "zh-TW", name: "Chinese (Traditional)", nativeName: "繁體中文", flag: "🇹🇼", region: "Asia" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", region: "Asia" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", region: "Europe" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", region: "Europe" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", rtl: true, region: "Middle East" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩", region: "Asia" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹", region: "Europe" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", region: "Europe" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", region: "Asia" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳", region: "Asia" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", region: "Europe" },
  { code: "jv", name: "Javanese", nativeName: "Basa Jawa", flag: "🇮🇩", region: "Asia" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", region: "Asia" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳", region: "Asia" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳", region: "Asia" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳", region: "Asia" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", region: "Asia" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", region: "Europe" },
  
  // European Languages
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", region: "Europe" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱", region: "Europe" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦", region: "Europe" },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "🇷🇴", region: "Europe" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", region: "Europe" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷", region: "Europe" },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "🇨🇿", region: "Europe" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪", region: "Europe" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", flag: "🇭🇺", region: "Europe" },
  { code: "be", name: "Belarusian", nativeName: "Беларуская", flag: "🇧🇾", region: "Europe" },
  { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰", region: "Europe" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", flag: "🇫🇮", region: "Europe" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", flag: "🇸🇰", region: "Europe" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴", region: "Europe" },
  { code: "bg", name: "Bulgarian", nativeName: "Български", flag: "🇧🇬", region: "Europe" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", flag: "🇭🇷", region: "Europe" },
  { code: "sr", name: "Serbian", nativeName: "Српски", flag: "🇷🇸", region: "Europe" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių", flag: "🇱🇹", region: "Europe" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu", flag: "🇱🇻", region: "Europe" },
  { code: "et", name: "Estonian", nativeName: "Eesti", flag: "🇪🇪", region: "Europe" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina", flag: "🇸🇮", region: "Europe" },
  { code: "sq", name: "Albanian", nativeName: "Shqip", flag: "🇦🇱", region: "Europe" },
  { code: "mk", name: "Macedonian", nativeName: "Македонски", flag: "🇲🇰", region: "Europe" },
  { code: "is", name: "Icelandic", nativeName: "Íslenska", flag: "🇮🇸", region: "Europe" },
  { code: "ga", name: "Irish", nativeName: "Gaeilge", flag: "🇮🇪", region: "Europe" },
  { code: "mt", name: "Maltese", nativeName: "Malti", flag: "🇲🇹", region: "Europe" },
  
  // Asian Languages
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭", region: "Asia" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰", rtl: true, region: "Asia" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩", region: "Asia" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾", region: "Asia" },
  { code: "km", name: "Khmer", nativeName: "ខ្មែរ", flag: "🇰🇭", region: "Asia" },
  { code: "lo", name: "Lao", nativeName: "ລາວ", flag: "🇱🇦", region: "Asia" },
  { code: "my", name: "Burmese", nativeName: "မြန်မာ", flag: "🇲🇲", region: "Asia" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", flag: "🇳🇵", region: "Asia" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල", flag: "🇱🇰", region: "Asia" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳", region: "Asia" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳", region: "Asia" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳", region: "Asia" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳", region: "Asia" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", flag: "🇮🇳", region: "Asia" },
  { code: "tl", name: "Tagalog", nativeName: "Tagalog", flag: "🇵🇭", region: "Asia" },
  { code: "mn", name: "Mongolian", nativeName: "Монгол", flag: "🇲🇳", region: "Asia" },
  { code: "ka", name: "Georgian", nativeName: "ქართული", flag: "🇬🇪", region: "Asia" },
  { code: "hy", name: "Armenian", nativeName: "Հայերեն", flag: "🇦🇲", region: "Asia" },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycan", flag: "🇦🇿", region: "Asia" },
  { code: "uz", name: "Uzbek", nativeName: "Oʻzbek", flag: "🇺🇿", region: "Asia" },
  { code: "kk", name: "Kazakh", nativeName: "Қазақ", flag: "🇰🇿", region: "Asia" },
  { code: "ky", name: "Kyrgyz", nativeName: "Кыргызча", flag: "🇰🇬", region: "Asia" },
  { code: "tg", name: "Tajik", nativeName: "Тоҷикӣ", flag: "🇹🇯", region: "Asia" },
  { code: "tk", name: "Turkmen", nativeName: "Türkmen", flag: "🇹🇲", region: "Asia" },
  
  // Middle Eastern & African Languages
  { code: "fa", name: "Persian", nativeName: "فارسی", flag: "🇮🇷", rtl: true, region: "Middle East" },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱", rtl: true, region: "Middle East" },
  { code: "ku", name: "Kurdish", nativeName: "Kurdî", flag: "🏴", region: "Middle East" },
  { code: "ps", name: "Pashto", nativeName: "پښتو", flag: "🇦🇫", rtl: true, region: "Middle East" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", flag: "🇪🇹", region: "Africa" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪", region: "Africa" },
  { code: "ha", name: "Hausa", nativeName: "Hausa", flag: "🇳🇬", region: "Africa" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá", flag: "🇳🇬", region: "Africa" },
  { code: "ig", name: "Igbo", nativeName: "Igbo", flag: "🇳🇬", region: "Africa" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu", flag: "🇿🇦", region: "Africa" },
  { code: "xh", name: "Xhosa", nativeName: "isiXhosa", flag: "🇿🇦", region: "Africa" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans", flag: "🇿🇦", region: "Africa" },
  { code: "so", name: "Somali", nativeName: "Soomaali", flag: "🇸🇴", region: "Africa" },
  { code: "rw", name: "Kinyarwanda", nativeName: "Ikinyarwanda", flag: "🇷🇼", region: "Africa" },
  
  // Americas
  { code: "pt-BR", name: "Portuguese (Brazil)", nativeName: "Português (Brasil)", flag: "🇧🇷", region: "Americas" },
  { code: "es-MX", name: "Spanish (Mexico)", nativeName: "Español (México)", flag: "🇲🇽", region: "Americas" },
  { code: "es-AR", name: "Spanish (Argentina)", nativeName: "Español (Argentina)", flag: "🇦🇷", region: "Americas" },
  { code: "qu", name: "Quechua", nativeName: "Runa Simi", flag: "🇵🇪", region: "Americas" },
  { code: "gn", name: "Guaraní", nativeName: "Avañe'ẽ", flag: "🇵🇾", region: "Americas" },
  { code: "ay", name: "Aymara", nativeName: "Aymar aru", flag: "🇧🇴", region: "Americas" },
  
  // Additional Languages
  { code: "cy", name: "Welsh", nativeName: "Cymraeg", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", region: "Europe" },
  { code: "eu", name: "Basque", nativeName: "Euskara", flag: "🏴", region: "Europe" },
  { code: "ca", name: "Catalan", nativeName: "Català", flag: "🏴", region: "Europe" },
  { code: "gl", name: "Galician", nativeName: "Galego", flag: "🏴", region: "Europe" },
  { code: "la", name: "Latin", nativeName: "Latina", flag: "🏛️", region: "Historical" },
  { code: "eo", name: "Esperanto", nativeName: "Esperanto", flag: "🌍", region: "Constructed" },
]

/**
 * Get language by code
 */
export function getLanguage(code: string): Language | undefined {
  return WORLD_LANGUAGES.find(lang => lang.code === code)
}

/**
 * Get languages by region
 */
export function getLanguagesByRegion(region: string): Language[] {
  return WORLD_LANGUAGES.filter(lang => lang.region === region)
}

/**
 * Get all unique regions
 */
export function getAllRegions(): string[] {
  return Array.from(new Set(WORLD_LANGUAGES.map(lang => lang.region))).sort()
}

/**
 * Check if language is right-to-left
 */
export function isRTL(code: string): boolean {
  const lang = getLanguage(code)
  return lang?.rtl === true
}

/**
 * Get language display name
 */
export function getLanguageDisplayName(code: string, showNative: boolean = true): string {
  const lang = getLanguage(code)
  if (!lang) return code
  
  if (showNative && lang.name !== lang.nativeName) {
    return `${lang.nativeName} (${lang.name})`
  }
  return lang.nativeName
}

import { useState } from "react";
import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";

export type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
];

interface LanguageSwitcherProps {
  currentLanguage?: string;
  onLanguageChange?: (languageCode: string) => void;
  variant?: "default" | "ghost" | "outline";
  showLabel?: boolean;
}

export function LanguageSwitcher({
  currentLanguage = "en",
  onLanguageChange,
  variant = "ghost",
  showLabel = false,
}: LanguageSwitcherProps) {
  const [selectedLang, setSelectedLang] = useState(currentLanguage);

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLang(languageCode);
    onLanguageChange?.(languageCode);
    // TODO: Implement i18n integration here
    console.log("Language changed to:", languageCode);
  };

  const currentLangData = SUPPORTED_LANGUAGES.find((lang) => lang.code === selectedLang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className="gap-2"
          aria-label={`Current language: ${currentLangData?.name}. Click to change language`}
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          {showLabel && (
            <span className="hidden md:inline-block">
              {currentLangData?.flag} {currentLangData?.nativeName}
            </span>
          )}
          {!showLabel && (
            <span className="sr-only">
              {currentLangData?.name}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between cursor-pointer"
            aria-label={`Switch to ${language.name}`}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true">{language.flag}</span>
              <span>{language.nativeName}</span>
              <span className="text-xs text-slate-500">({language.name})</span>
            </span>
            {selectedLang === language.code && (
              <Check className="h-4 w-4 text-blue-600" aria-label="Currently selected" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

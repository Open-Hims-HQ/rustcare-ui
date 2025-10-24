import { useState } from "react";
import { Globe, Check, Search, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AccessibleIcon } from "@radix-ui/react-accessible-icon";
import { WORLD_LANGUAGES, getLanguagesByRegion, getAllRegions, type Language } from "~/lib/i18n/languages";
import { useTranslation } from "~/hooks/useTranslation";

interface LanguageSwitcherProps {
  currentLanguage?: string;
  onLanguageChange?: (languageCode: string) => void;
  variant?: "default" | "ghost" | "outline";
  showLabel?: boolean;
  /** Show only popular languages (top 20) */
  popularOnly?: boolean;
}

export function LanguageSwitcher({
  currentLanguage,
  onLanguageChange,
  variant = "ghost",
  showLabel = false,
  popularOnly = false,
}: LanguageSwitcherProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { t, currentLanguage: globalLanguage, setLanguage: setGlobalLanguage } = useTranslation();

  // Use global language if currentLanguage prop not provided
  const activeLanguage = currentLanguage || globalLanguage;

  const handleLanguageChange = (languageCode: string) => {
    setGlobalLanguage(languageCode);
    onLanguageChange?.(languageCode);
    setIsOpen(false);
    setSearchQuery("");
    console.log("Language changed to:", languageCode);
  };

  const currentLangData = WORLD_LANGUAGES.find((lang) => lang.code === activeLanguage);
  
  // Filter languages by search query
  const filterLanguages = (languages: Language[]) => {
    if (!searchQuery.trim()) return languages;
    
    const query = searchQuery.toLowerCase();
    return languages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(query) ||
        lang.nativeName.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query)
    );
  };
  
  // Filter languages if popularOnly is true (first 20 languages)
  const displayLanguages = popularOnly ? WORLD_LANGUAGES.slice(0, 20) : WORLD_LANGUAGES;
  const filteredLanguages = filterLanguages(displayLanguages);
  
  // Group languages by region for better UX
  const regions = getAllRegions();
  const filteredRegions = regions.filter(region => {
    const languagesInRegion = filterLanguages(getLanguagesByRegion(region));
    return languagesInRegion.length > 0;
  });

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className="gap-2"
          aria-label={t("accessibility.currentLanguage", { language: currentLangData?.name || activeLanguage || "English" })}
        >
          <span className="text-xs font-medium uppercase" aria-hidden="true">
            {activeLanguage}
          </span>
          <Globe className="h-4 w-4" />
          <span className="text-base" aria-hidden="true">
            {currentLangData?.flag}
          </span>
          {showLabel && (
            <span className="hidden md:inline-block">
              {currentLangData?.nativeName}
            </span>
          )}
          {!showLabel && (
            <VisuallyHidden>
              {currentLangData?.name}
            </VisuallyHidden>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 max-h-[500px] overflow-hidden flex flex-col"
        onCloseAutoFocus={(e) => {
          // Prevent focus from going back to trigger when closing
          e.preventDefault();
        }}
      >
        <DropdownMenuLabel className="pb-2">
          {t("language.select")} {popularOnly && `(${t("language.popular")})`}
        </DropdownMenuLabel>
        
        {/* Search Input */}
        <div className="px-2 pb-2">
          <div className="relative">
            <AccessibleIcon label={t("common.search")}>
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            </AccessibleIcon>
            <Input
              type="text"
              placeholder={t("language.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-8 h-9"
              aria-label={t("language.searchLabel")}
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setSearchQuery("")}
                aria-label={t("common.clear")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* Scrollable Language List */}
        <div className="overflow-y-auto max-h-[350px]" role="listbox" aria-label={t("language.available")}>
          {filteredLanguages.length === 0 ? (
            <div className="px-2 py-4 text-center text-sm text-slate-500">
              {t("language.noResults")}
            </div>
          ) : popularOnly ? (
            // Show flat list for popular languages
            filteredLanguages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className="flex items-center justify-between cursor-pointer px-3 py-2"
                aria-label={t("accessibility.switchLanguage", { language: language.name })}
                role="option"
                aria-selected={activeLanguage === language.code}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-lg">{language.flag}</span>
                  <span>{language.nativeName}</span>
                  {language.name !== language.nativeName && (
                    <span className="text-xs text-slate-500">({language.name})</span>
                  )}
                </span>
                {activeLanguage === language.code && (
                  <AccessibleIcon label={t("accessibility.selected")}>
                    <Check className="h-4 w-4 text-blue-600" />
                  </AccessibleIcon>
                )}
              </DropdownMenuItem>
            ))
          ) : (
            // Show grouped by region for all languages
            filteredRegions.map((region, idx) => {
              const languagesInRegion = filterLanguages(getLanguagesByRegion(region));
              return (
                <div key={region} role="group" aria-label={region}>
                  {idx > 0 && <Separator decorative className="my-1" />}
                  <DropdownMenuLabel className="text-xs text-slate-500 font-semibold px-3 py-1.5">
                    {region}
                  </DropdownMenuLabel>
                  {languagesInRegion.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className="flex items-center justify-between cursor-pointer pl-6 pr-3 py-2"
                      aria-label={t("accessibility.switchLanguage", { language: language.name })}
                      role="option"
                      aria-selected={activeLanguage === language.code}
                    >
                      <span className="flex items-center gap-2">
                        <span aria-hidden="true" className="text-base">{language.flag}</span>
                        <span className="text-sm">{language.nativeName}</span>
                      </span>
                      {activeLanguage === language.code && (
                        <AccessibleIcon label={t("accessibility.selected")}>
                          <Check className="h-4 w-4 text-blue-600" />
                        </AccessibleIcon>
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { generateNonce } from "./lib/security";
import { DirectionProvider } from "@radix-ui/react-direction";
import { TranslationProvider } from "~/hooks/useTranslation";
import { useState, useEffect } from "react";
import { getLanguage } from "~/lib/i18n/languages";

import styles from "./styles/tailwind.css?url";

export const links: LinksFunction = () => [
  // DNS Prefetch for external domains
  { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
  { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
  
  // Preconnect to critical origins
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  
  // Preload critical fonts
  {
    rel: "preload",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    as: "style",
  },
  
  // Load fonts with optimal settings
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  
  // Load critical CSS
  { rel: "stylesheet", href: styles },
];

// Generate CSRF token on each request with caching
export async function loader({ request }: LoaderFunctionArgs) {
  const csrfToken = generateNonce();
  
  return json(
    { csrfToken },
    {
      headers: {
        // Set CSRF token as cookie
        'Set-Cookie': `XSRF-TOKEN=${csrfToken}; Path=/; HttpOnly; SameSite=Strict; Secure=${process.env.NODE_ENV === 'production'}`,
        // Add caching headers for static content
        'Cache-Control': 'public, max-age=3600, must-revalidate',
      },
    }
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Performance & SEO meta tags */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="color-scheme" content="light" />
        
        {/* Preload critical resources */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { csrfToken } = useLoaderData<typeof loader>();
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");

  // Load language preference from localStorage on mount
  const [initialLanguage, setInitialLanguage] = useState("en");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("preferredLanguage") || "en";
      setInitialLanguage(savedLanguage);
      
      // Set text direction based on language
      const lang = getLanguage(savedLanguage);
      setDirection(lang?.rtl ? "rtl" : "ltr");
    }
  }, []);
  
  return (
    <DirectionProvider dir={direction}>
      <TranslationProvider 
        defaultLanguage={initialLanguage} 
        preloadLanguages={["en", "es", "fr", "zh", "ar"]}
      >
        <Outlet context={{ csrfToken }} />
      </TranslationProvider>
    </DirectionProvider>
  );
}

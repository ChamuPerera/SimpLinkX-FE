import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/index.css";

import App from "@/App.tsx";
import { Toaster } from "@/components/ui/sonner";
import { TanstackProvider } from "@/providers/tanstack-provider.tsx";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TanstackProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        forcedTheme="light"
        disableTransitionOnChange
      >
        <App />
        <Toaster richColors closeButton position="top-right" />
      </ThemeProvider>
    </TanstackProvider>
  </StrictMode>,
);

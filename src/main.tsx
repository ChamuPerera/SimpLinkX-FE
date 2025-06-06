import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/index.css";

import App from "@/App.tsx";
import { Provider } from "@/components/ui/provider.tsx";
import { TanstackProvider } from "@/providers/tanstack-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <TanstackProvider>
        <App />
      </TanstackProvider>
    </Provider>
  </StrictMode>,
);

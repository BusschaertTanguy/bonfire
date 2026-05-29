import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { authApi } from "@/api/auth/auth.api.ts";
import App from "@/App.tsx";
import "@/index.css";
import { AuthProvider } from "@/providers/auth-provider.tsx";

async function bootstrap() {
    await authApi.antiforgery();

    const rootElement = document.getElementById("root");

    if (!rootElement) {
        throw new Error("Root element not found");
    }

    createRoot(rootElement).render(
        <StrictMode>
            <AuthProvider>
                <App />
            </AuthProvider>
        </StrictMode>
    );
}

await bootstrap();

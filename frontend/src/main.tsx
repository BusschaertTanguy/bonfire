import { authApi } from "@/api/auth/auth.api.ts";
import App from "@/App.tsx";
import "@/index.css";
import { AuthProvider } from "@/providers/auth-provider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});

async function bootstrap() {
    await authApi.antiforgery();

    const rootElement = document.getElementById("root");

    if (!rootElement) {
        throw new Error("Root element not found");
    }

    createRoot(rootElement).render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </QueryClientProvider>
        </StrictMode>
    );
}

await bootstrap();

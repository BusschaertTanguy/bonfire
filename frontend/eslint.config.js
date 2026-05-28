import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import pluginRouter from "@tanstack/eslint-plugin-router";

export default defineConfig([
    globalIgnores(["dist"]),
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            js.configs.recommended,
            tseslint.configs.strictTypeChecked,
            tseslint.configs.stylisticTypeChecked,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            ...pluginRouter.configs["flat/recommended"],
            eslintConfigPrettier,
        ],
        rules: {
            "@typescript-eslint/no-misused-promises": "off",
            "@typescript-eslint/only-throw-error": [
                "error",
                {
                    allow: [
                        {
                            from: "package",
                            package: "@tanstack/router-core",
                            name: "Redirect",
                        },
                        {
                            from: "package",
                            package: "@tanstack/router-core",
                            name: "NotFoundError",
                        },
                    ],
                },
            ],
            "react-refresh/only-export-components": [
                "warn",
                {
                    extraHOCs: [
                        "createFileRoute",
                        "createRootRouteWithContext",
                    ],
                },
            ],
        },
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                projectService: true,
            },
        },
    },
]);

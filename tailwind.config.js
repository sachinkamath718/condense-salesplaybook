/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "#f9fafb", // gray-50 — light page bg
                foreground: "#111827", // gray-900 — dark text
                primary: {
                    DEFAULT: "#2563eb", // blue-600
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#f3f4f6", // gray-100
                    foreground: "#1f2937", // gray-800
                },
                destructive: {
                    DEFAULT: "#ef4444", // red-500
                    foreground: "#ffffff",
                },
                muted: {
                    DEFAULT: "#f9fafb", // gray-50
                    foreground: "#6b7280", // gray-500
                },
                accent: {
                    DEFAULT: "#2563eb", // blue-600
                    foreground: "#ffffff",
                },
                success: {
                    DEFAULT: "#16a34a", // green-600
                    foreground: "#ffffff"
                },
                sidebar: {
                    DEFAULT: "hsl(var(--sidebar-background))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "hsl(var(--sidebar-primary))",
                    "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
                    accent: "hsl(var(--sidebar-accent))",
                    "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
                    border: "hsl(var(--sidebar-border))",
                    ring: "hsl(var(--sidebar-ring))",
                },
            },
            borderRadius: {
                lg: `var(--radius)`,
                md: `calc(var(--radius) - 2px)`,
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [],
}

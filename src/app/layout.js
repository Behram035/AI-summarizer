import { Toaster } from "react-hot-toast";
import AppShell from "../components/layout/AppShell";
import "./globals.css";
import ReduxProvider from "../components/layout/ReduxProvider";

export const metadata = {
  title: "AI Summarizer - Text, Voice and Audio",
  description:
    "Transform text and voice into crisp summaries, bullet points, and key insights using Gemini AI.",
  keywords: [
    "AI summarizer",
    "text summarization",
    "voice notes",
    "Gemini AI",
    "NLP",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-ink-950 text-slate-200 min-h-screen">
        <ReduxProvider>
          <AppShell>{children}</AppShell>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1A1A24",
                color: "#CBD5E1",
                border: "1px solid rgba(52,211,153,0.2)",
                borderRadius: "8px",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#34D399", secondary: "#0A0A0F" },
              },
              error: {
                iconTheme: { primary: "#F87171", secondary: "#0A0A0F" },
              },
            }}
          />
        </ReduxProvider>
      </body>
    </html>
  );
}

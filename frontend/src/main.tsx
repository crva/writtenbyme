import { Toaster } from "@/components/ui/sonner";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import "./index.css";
import Article from "./views/Article.tsx";
import ArticleView from "./views/ArticleView.tsx";
import Dashboard from "./views/Dashboard.tsx";
import MagicLinkVerify from "./views/MagicLinkVerify.tsx";
import Privacy from "./views/Privacy.tsx";
import TermsOfService from "./views/TermsOfService.tsx";
import UserArticles from "./views/UserArticles.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/auth/magic-link" element={<MagicLinkVerify />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/dashboard/articles/:articleId"
            element={<ArticleView />}
          />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/:username" element={<UserArticles />} />
          <Route path="/:username/:articleSlug" element={<Article />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    <Toaster />
  </StrictMode>,
);

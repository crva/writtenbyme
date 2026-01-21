import { PageLayout } from "@/components/PageContent";
import { trackArticleView } from "@/lib/analyticsApi";
import { useArticle } from "@/stores/articleStore";
import { useUser } from "@/stores/userStore";
import MDEditor from "@uiw/react-md-editor";
import { ArrowLeft, Lock } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";

export default function Article() {
  const { username, articleSlug } = useParams<{
    username: string;
    articleSlug: string;
  }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const currentArticle = useArticle((state) => state.currentArticle);
  const loading = useArticle((state) => state.loading);
  const articleError = useArticle((state) => state.articleError);
  const fetchArticleBySlug = useArticle((state) => state.fetchArticleBySlug);
  const clearCurrentArticle = useArticle((state) => state.clearCurrentArticle);
  const sessionStartTime = useRef<number | null>(null);
  const maxScrollPercentageRef = useRef<number>(0);

  // Check if current user is the author
  const isOwner = user && currentArticle?.author === user.username;

  // Fetch article when route params change
  useEffect(() => {
    if (!username || !articleSlug) return;
    clearCurrentArticle();
    fetchArticleBySlug(username, articleSlug);
  }, [username, articleSlug, fetchArticleBySlug, clearCurrentArticle]);

  // Reset timer when article loads
  useEffect(() => {
    if (currentArticle) {
      sessionStartTime.current = Date.now();
      maxScrollPercentageRef.current = 0;
    }
  }, [currentArticle, currentArticle?.id]);

  // Track scroll depth
  useEffect(() => {
    if (!currentArticle) return;

    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled =
        scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      maxScrollPercentageRef.current = Math.max(
        maxScrollPercentageRef.current,
        scrolled,
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentArticle]);

   // Track view when user leaves the page
   useEffect(() => {
     if (!currentArticle) return;

     const handleBeforeUnload = () => {
       if (sessionStartTime.current) {
         const sessionDuration = Math.round(
           (Date.now() - sessionStartTime.current) / 1000,
         );
         if (sessionDuration > 0) {
           // Use sendBeacon for page unload - it's designed for this
           const params = new URLSearchParams();
           params.append("sessionDuration", sessionDuration.toString());
           params.append(
             "maxScrollPercentage",
             Math.round(maxScrollPercentageRef.current).toString(),
           );
           navigator.sendBeacon(
             `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/articles/${currentArticle.id}/track`,
             params,
           );
         }
       }
     };

     // Also track when navigating away via component cleanup
     const cleanup = () => {
       if (sessionStartTime.current) {
         const sessionDuration = Math.round(
           (Date.now() - sessionStartTime.current) / 1000,
         );
         if (sessionDuration > 0) {
           trackArticleView(
             currentArticle.id,
             sessionDuration,
             Math.round(maxScrollPercentageRef.current),
           );
         }
       }
     };

     window.addEventListener("beforeunload", handleBeforeUnload);
     return () => {
       window.removeEventListener("beforeunload", handleBeforeUnload);
       cleanup();
     };
   }, [currentArticle]);

   return (
     <PageLayout
       loading={loading}
       username={username || ""}
       headerContent={
         <div className="flex justify-between items-baseline">
           <ArrowLeft className="h-4 w-4 mr-2" />
           <div>
             <span>written by </span>
             <span className="text-primary">{username}</span>
           </div>
           <span></span>
         </div>
       }
       onHeaderClick={() => navigate(`/${username}`)}
     >
       {(articleError || currentArticle?.status === "locked") && (
         <div className="flex items-center gap-3 p-4 mb-6 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
           <Lock className="h-5 w-5 shrink-0" />
           <div>
             <p className="font-semibold">Article Locked</p>
             <p className="text-sm">
               {articleError || (isOwner ? "This article is locked. Resubscribe to unlock all your articles." : "This article is locked and not accessible.")}
             </p>
           </div>
         </div>
       )}
       {currentArticle && currentArticle.status !== "locked" && (
         <>
           {/* Author and Title */}
           <div className="mb-8">
             <h1 className="text-4xl md:text-5xl font-bold mb-2 wrap-break-word">
               {currentArticle.title}
             </h1>
             <span className="text-sm text-muted">
               Last update:{" "}
               {new Date(currentArticle.updatedAt).toLocaleDateString("en-US", {
                 day: "numeric",
                 month: "long",
                 year: "numeric",
               })}
             </span>
           </div>

           {/* Markdown Content */}
           <article className="react-markdown">
             <div data-color-mode="dark">
               <MDEditor.Markdown
                 source={currentArticle.content}
                 style={{
                   backgroundColor: "transparent",
                   color: "inherit",
                   padding: 0,
                 }}
               />
             </div>
           </article>
         </>
       )}
     </PageLayout>
   );
}

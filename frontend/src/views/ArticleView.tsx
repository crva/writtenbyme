import MagicLinkDialog from "@/components/Account/MagicLinkDialog";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
import ArticleEditor from "@/components/Dashboard/ArticleEditor/ArticleEditor";
import Loader from "@/components/Loader";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useArticle } from "@/stores/articleStore";
import { useUser } from "@/stores/userStore";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";

export default function ArticleView() {
  const { articleId } = useParams<{ articleId: string }>();
  const [searchParams] = useSearchParams();
  const { articles, loading, setSelectedArticle, fetchArticles } = useArticle();
  const hasFetched = useArticle((s) => s.hasFetched);
  const { isAuthenticated, checkAuth } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);

  const tab = searchParams.get("tab") || "editor";
  const article = articles.find((a) => a.id === articleId);

  // Check auth on mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsInitialized(true);
    };
    initAuth();
  }, [checkAuth]);

   // Fetch articles when authenticated
   useEffect(() => {
     if (isInitialized && isAuthenticated) {
       // Fetch only once per session; stops loops when list is empty
       if (!hasFetched) {
         fetchArticles();
       }
     }
   }, [isInitialized, isAuthenticated, fetchArticles, hasFetched]);

  // Set selected article when component mounts or articleId changes
  useEffect(() => {
    if (articleId && article) {
      setSelectedArticle(articleId);
    }
  }, [articleId, article, setSelectedArticle]);

   if (!isInitialized) {
     return (
       <SidebarProvider>
         <AppSidebar />
         <SidebarInset>
           <div className="md:hidden p-2 border-b">
             <SidebarTrigger />
           </div>
           <main className="flex-1 flex items-center justify-center p-2.5">
             <Loader />
           </main>
         </SidebarInset>
       </SidebarProvider>
     );
   }

   if (!isAuthenticated) {
     return <MagicLinkDialog open={true} onOpenChange={() => {}} />;
   }

   if (!article) {
     if (loading) {
       return (
         <SidebarProvider>
           <AppSidebar />
           <SidebarInset>
             <div className="md:hidden p-2 border-b">
               <SidebarTrigger />
             </div>
             <div className="flex-1 flex items-center justify-center">
               <Loader />
             </div>
           </SidebarInset>
         </SidebarProvider>
       );
     }
     return (
       <SidebarProvider>
         <AppSidebar />
         <SidebarInset>
           <div className="md:hidden p-2 border-b">
             <SidebarTrigger />
           </div>
           <div className="flex-1 flex items-center justify-center">
             <p className="text-slate-600 dark:text-slate-400">
               Article not found
             </p>
           </div>
         </SidebarInset>
       </SidebarProvider>
     );
   }

   return (
     <SidebarProvider>
       <AppSidebar />
       <SidebarInset>
         <ArticleEditor
           article={article}
           initialTab={tab as "editor" | "analytics"}
         />
       </SidebarInset>
     </SidebarProvider>
   );
}

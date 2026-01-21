import { Footer } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import type { ReactNode } from "react";

interface PageLayoutProps {
  loading: boolean;
  username: string;
  headerContent?: ReactNode;
  children: ReactNode;
  onHeaderClick?: () => void;
}

export function PageLayout({
  loading,
  username,
  headerContent,
  children,
  onHeaderClick,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Username Header - Always Visible */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-12">
        <div
          className="text-2xl md:text-2xl font-bold mb-4 text-center cursor-pointer transition-opacity"
          onClick={onHeaderClick}
        >
          {headerContent || (
            <>
              <span>articles written by </span>
              <span className="text-primary">{username}</span>
            </>
          )}
        </div>
        <Separator />
      </div>

       {/* Main Content */}
       <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 md:py-8">
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          children
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

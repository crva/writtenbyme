export type Article = {
  id: string;
  title: string;
  slug?: string;
  content: string;
  status?: "published" | "locked";
  createdAt: string;
  updatedAt: string;
  author?: string;
};

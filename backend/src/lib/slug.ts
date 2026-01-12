/**
 * Generate a URL-friendly slug from text
 * Removes accents, special characters, and converts to lowercase with hyphens
 * Example: "Getting Started with React" -> "getting-started-with-react"
 */
export function generateSlug(text: string): string {
  return (
    text
      // Convert to lowercase
      .toLowerCase()
      // Remove accents using normalize
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // Replace spaces and underscores with hyphens
      .replace(/[\s_]+/g, "-")
      // Remove special characters except hyphens and numbers
      .replace(/[^a-z0-9-]/g, "")
      // Remove multiple consecutive hyphens
      .replace(/-+/g, "-")
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
}

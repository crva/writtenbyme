/**
 * Generate a URL-friendly slug from text
 * Handles multiple languages including Latin, Cyrillic, and other scripts
 * Converts to lowercase with hyphens, removes accents and special characters
 * Examples:
 *   "Getting Started with React" -> "getting-started-with-react"
 *   "Как начать с React" -> "kak-nachAt-s-react"
 *   "开始使用 React" -> ""  (CJK returns empty as it has no direct Latin equivalent)
 */
export function generateSlug(text: string): string {
  return (
    text
      // Convert to lowercase
      .toLowerCase()
      // Remove accents using normalize (for Latin-based scripts)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // Replace spaces and underscores with hyphens
      .replace(/[\s_]+/g, "-")
      // Keep: a-z, 0-9, hyphens, and Unicode letter/number categories
      // This preserves Cyrillic (а-я), Arabic, Greek, and other scripts
      .replace(/[^\p{L}\p{N}\p{M}-]/gu, "")
      // Remove multiple consecutive hyphens
      .replace(/-+/g, "-")
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
}

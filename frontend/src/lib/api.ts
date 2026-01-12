/**
 * API Configuration and Client
 * Centralized API client for all backend communication
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

/**
 * Fetch wrapper with default configuration
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Include cookies for session-based auth
  });

  if (!response.ok) {
    const error = (await response.json()) as { error?: string };
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/**
 * GET request
 */
export const apiGet = <T>(endpoint: string) =>
  apiCall<T>(endpoint, { method: "GET" });

/**
 * POST request
 */
export const apiPost = <T>(endpoint: string, data?: Record<string, unknown>) =>
  apiCall<T>(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });

/**
 * PUT request
 */
export const apiPut = <T>(endpoint: string, data?: Record<string, unknown>) =>
  apiCall<T>(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });

/**
 * DELETE request
 */
export const apiDelete = <T>(endpoint: string) =>
  apiCall<T>(endpoint, { method: "DELETE" });

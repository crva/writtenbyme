import { useUser } from "@/stores/userStore";

/**
 * Hook to check if the current user has a paid subscription
 * @returns {boolean} true if user is authenticated and has paid, false otherwise
 */
export const usePaidUser = (): boolean => {
  const user = useUser((state) => state.user);
  const isAuthenticated = useUser((state) => state.isAuthenticated);

  return isAuthenticated && user?.isPaid === true;
};

/**
 * Hook to get the paid status and authentication status
 * @returns {Object} Object containing isPaid boolean and isAuthenticated boolean
 */
export const usePaidStatus = () => {
  const user = useUser((state) => state.user);
  const isAuthenticated = useUser((state) => state.isAuthenticated);

  return {
    isPaid: isAuthenticated && user?.isPaid === true,
    isAuthenticated,
  };
};

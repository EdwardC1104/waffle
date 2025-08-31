import useAuth from "@/hooks/useAuth";
import { User } from "@/types";

export function useUser(): User {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (!isLoading && (!isAuthenticated || !user)) {
    throw new Error(
      "useUser can only be used within components that guarantee authentication"
    );
  }

  return user as User;
}

export default useUser;

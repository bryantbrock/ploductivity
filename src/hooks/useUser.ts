import { useAuth } from "@clerk/nextjs";
import { useFindUniqueUser } from "prisma-hooks";

export const useUser = () => {
  const { userId } = useAuth();

  return useFindUniqueUser({ query: { where: { clerkId: userId ?? "" } } });
};

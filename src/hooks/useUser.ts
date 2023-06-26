import { useAuth } from "@clerk/nextjs";
import { useFindUniquePlodder } from "prisma-hooks";

export const useUser = () => {
  const { userId } = useAuth();

  return useFindUniquePlodder({ query: { where: { clerkId: userId ?? "" } } });
};

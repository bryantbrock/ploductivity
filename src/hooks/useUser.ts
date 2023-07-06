import { useAuth } from "@clerk/nextjs";
import { useCreateUser, useFindUniqueUser } from "prisma-hooks";
import { useEffect } from "react";

export const useUser = () => {
  const { userId } = useAuth();
  const { mutateAsync: createUser } = useCreateUser();

  const response = useFindUniqueUser({
    query: { where: { clerkId: userId ?? "" } },
  });

  useEffect(() => {
    const create = async () => {
      await createUser({
        data: { clerkId: userId ?? "" },
      });
    };

    if (!response.data && response.isFetched && userId) {
      create();
    }
  }, [createUser, response.data, response.isFetched, userId]);

  return response;
};

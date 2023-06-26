import { Center } from "@chakra-ui/react";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <Center h="80vh">
      <SignUp />
    </Center>
  );
}

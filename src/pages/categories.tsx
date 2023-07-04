import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Flex,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import {
  useCreateCategory,
  useDeleteCategory,
  useFindManyCategorys,
  useUpdateCategory,
} from "prisma-hooks";
import { useUser } from "@/hooks/useUser";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import Link from "next/link";
import { AddIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { debounce } from "lodash";
import { Category } from "@prisma/client";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { EllipsisVerticalIcon } from "@/icons/EllipsisVerticalIcon";

const CategoryInput = ({
  category,
  index,
  onUpdate,
}: {
  category: Category;
  index: number;
  onUpdate: (value: string, id: number) => void;
}) => {
  const [value, setValue] = useState(category.name);

  useEffect(() => {
    onUpdate(value, category.id);
  }, [category.id, onUpdate, value]);

  return (
    <Input
      name={`categories.${index}.name`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      borderColor="transparent"
      px={2}
      flexGrow={1}
      _hover={{ borderColor: "gray.200" }}
    />
  );
};

const Index = () => {
  const { data: user } = useUser();
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const {
    data: categories = [],
    isLoading,
    isFetched,
    refetch: refetchCategories,
  } = useFindManyCategorys({
    options: { enabled: !!user?.id },
    query: { where: { userId: user?.id } },
  });

  const { mutateAsync: createCategory } = useCreateCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const { mutateAsync: deleteCategory } = useDeleteCategory();

  const addNewCategory = useCallback(async () => {
    setIsCreatingCategory(true);
    await createCategory({
      data: { name: "New Category", user: { connect: { id: user?.id } } },
    });

    await refetchCategories();
    setIsCreatingCategory(false);
  }, [createCategory, refetchCategories, user?.id]);

  const onUpdateName = useCallback(
    async (value: string, id: number) => {
      await updateCategory({ data: { name: value }, where: { id } });
    },
    [updateCategory]
  );

  const debounceUpdateName = useMemo(
    () => debounce(onUpdateName, 700),
    [onUpdateName]
  );

  return (
    <Layout>
      <Flex justify="space-between" py={3} gap={2} align="center">
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/categories" fontWeight="semibold">
              Categories
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>
      {isLoading || !isFetched ? (
        <Flex direction="column" gap={2}>
          <Flex
            gap={2}
            direction="column"
            mt={4}
            borderWidth="1px"
            rounded="md"
            borderColor="gray.100"
            p={5}
          >
            <Skeleton h="20px" w="75%" />
            <Flex gap={2}>
              <Skeleton h="20px" w="50%" />
              <Skeleton h="20px" w="10%" />
            </Flex>
          </Flex>
          <Flex
            gap={2}
            direction="column"
            mt={4}
            borderWidth="1px"
            rounded="md"
            borderColor="gray.100"
            p={5}
          >
            <Skeleton h="20px" w="75%" />
            <Flex gap={2}>
              <Skeleton h="20px" w="50%" />
              <Skeleton h="20px" w="10%" />
            </Flex>
          </Flex>
        </Flex>
      ) : !categories.length ? (
        <Center
          borderWidth="1px"
          rounded="md"
          borderColor="gray.100"
          p={5}
          my={2}
        >
          <Text>No categories found.</Text>
        </Center>
      ) : (
        <Flex direction="column" gap={2} flexGrow={1}>
          {categories.map((category, i) => (
            <Flex
              key={category.id}
              justify="space-between"
              p={1}
              bg="white"
              rounded="md"
              align="center"
              shadow="sm"
            >
              <CategoryInput
                onUpdate={debounceUpdateName}
                index={i}
                category={category}
              />
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="goal menu"
                  icon={<EllipsisVerticalIcon h="20px" w="20px" />}
                  size="sm"
                  variant="ghost"
                />
                <MenuList>
                  <ConfirmDeleteModal
                    onDelete={async () => {
                      await deleteCategory({ where: { id: category.id } });
                      await refetchCategories();
                    }}
                  >
                    {({ onOpen }) => (
                      <MenuItem onClick={() => onOpen()}>Delete</MenuItem>
                    )}
                  </ConfirmDeleteModal>
                </MenuList>
              </Menu>
            </Flex>
          ))}
          <Button
            leftIcon={<AddIcon />}
            onClick={addNewCategory}
            isLoading={isCreatingCategory}
          >
            Add category
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default Index;

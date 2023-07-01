// import { ReactNode, useMemo } from "react";
// import {
//   ArrayPath,
//   Control,
//   FieldArray,
//   FieldArrayWithId,
//   FieldPath,
//   FieldValues,
//   Path,
//   useFieldArray,
// } from "react-hook-form";
// import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
// import {
//   FormControl,
//   FormLabel,
//   VStack,
//   IconButton,
//   Button,
//   Box,
// } from "@chakra-ui/react";
// import { BorderedHStack } from "../BorderedHStack";
// import { FormMultiSelect } from "./FormMultiSelect";
// import startCase from "lodash/startCase";

// type ValueObject<DK extends string> = { id: number } & Record<
//   DK,
//   string | number | Date | null
// >;

// type Props<T extends FieldValues> = {
//   control: Control<T, any>;
//   name: ArrayPath<T>;
//   label?: string;
//   relationName: FieldPath<FieldPath<T>>;
//   relationOptions: ValueObject<string>[];
//   relationDisplayKey: FieldPath<FieldPath<FieldPath<T>>>;
//   appendValue: FieldArray<T, ArrayPath<T>>;
//   isNewButtonDisabled?: boolean;
//   children: (
//     field: FieldArrayWithId<T, ArrayPath<T>>,
//     index: number
//   ) => ReactNode;
// };

// export const FormRelationInput = <T extends FieldValues>({
//   name,
//   label,
//   control,
//   children,
//   appendValue,
//   relationName,
//   relationOptions,
//   relationDisplayKey,
//   isNewButtonDisabled,
// }: Props<T>) => {
//   const defaultText = useMemo(() => startCase(name), [name]);
//   const { fields, append, remove } = useFieldArray({ control, name });

//   return (
//     <FormControl>
//       <FormLabel>{label ?? defaultText}</FormLabel>
//       <VStack spacing={1} mt={4} display="flex" justify="start">
//         {fields.map((field, index) => (
//           <BorderedHStack key={field.id}>
//             <FormMultiSelect
//               hideLabel
//               multiple={false}
//               name={
//                 `${name}.${index}.${relationName}` as Path<T> &
//                   (string | undefined)
//               }
//               options={relationOptions}
//               displayKey={relationDisplayKey as string}
//               variant="unstyled"
//               maxH="40px"
//               minW="200px"
//               display="flex"
//               flexWrap="wrap"
//               placeholder={`Select ${relationName}`}
//               control={control}
//             />
//             {children(field, index)}
//             <Box>
//               <IconButton
//                 icon={<DeleteIcon color="gray.600" />}
//                 aria-label="Delete"
//                 rounded="0 8px 8px 0"
//                 h="38px"
//                 onClick={() => remove(index)}
//               />
//             </Box>
//           </BorderedHStack>
//         ))}
//         <Button
//           leftIcon={<AddIcon h="10px" />}
//           w="full"
//           size="sm"
//           variant="outline"
//           isDisabled={isNewButtonDisabled}
//           onClick={() => append(appendValue)}
//         >
//           Add
//         </Button>
//       </VStack>
//     </FormControl>
//   );
// };

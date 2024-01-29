"use client";

import type { ShoppingList, ShoppingListItem, Unit } from "@prisma/client";
import ShoppingListHandler from "~/app/shopping-list/ShoppingListFormHandler";
import IngredientTable from "~/app/_components/IngredientTable";
import { Card, CardHeader } from "@nextui-org/card";
import {
  Button,
  CardBody,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import type { Ingredient } from "~/utils/IngredientCalculator";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { motion } from "framer-motion";
import { Modes } from "~/app/lib/shoppingListModes";
import { Controller, useForm } from "react-hook-form";
import UniversalModal from "~/app/_components/UniversalModal";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export interface ShoppingListTableProps {
  shoppingList: ShoppingList & {
    items: ShoppingListItem[];
  };
}

export default function ShoppingListCard({
  shoppingList,
}: ShoppingListTableProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(
    [],
  );
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();

  const schema = z.object({
    name: z.string().min(1),
    quantity: z.number().min(1),
    unit: z.enum(
      [
        "GRAM",
        "KILOGRAM",
        "LITER",
        "MILLILITER",
        "TEASPOON",
        "TABLESPOON",
        "CUP",
        "PINCH",
        "PIECE",
      ],
      {
        required_error: "Unit is required",
        invalid_type_error: "Invalid unit",
      },
    ),
  });

  const { control, handleSubmit, reset } = useForm({
    mode: "onTouched",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      quantity: 1,
      unit: "PIECE" as Unit,
    },
  });

  const router = useRouter();
  console.log(selectedIngredients);

  function onAdd(data: { name: string; quantity: number; unit: Unit }) {
    console.log(typeof data.unit);
    addMutation.mutate({
      shoppingListId: shoppingList.id,
      ingredients: [
        {
          name: data.name,
          quantity: data.quantity,
          unit: data.unit,
        },
      ],
    });
  }

  const addMutation = api.shoppingList.addItems.useMutation({
    onSuccess: () => {
      toast.success("Shopping list items deleted");
      router.refresh();
      onClose();
      reset();
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error deleting shopping list items");
    },
  });

  function onDelete() {
    deleteMutation.mutate({
      shoppingListId: shoppingList.id,
      items: selectedIngredients.flatMap((ingredient) => ingredient.id),
    });
  }

  const deleteMutation = api.shoppingList.deleteItems.useMutation({
    onSuccess: () => {
      toast.success("Shopping list items deleted");
      router.refresh();
      setSelectedIngredients([]);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error deleting shopping list items");
    },
  });

  return (
    <motion.div layout transition={{ type: "spring", duration: 0.2 }}>
      <Card className="w-full sm:w-[17rem]">
        <CardHeader className="flex flex-col items-start justify-center space-y-2">
          <div className="flex w-full flex-wrap items-center justify-between">
            <h2 className="text-xl font-semibold">{shoppingList.name}</h2>
            <div className="space-x-2">
              <ShoppingListHandler
                mode={Modes.EDIT}
                buttonSize="sm"
                shoppingList={shoppingList}
              />
              <ShoppingListHandler
                mode={Modes.DELETE}
                buttonSize="sm"
                shoppingList={shoppingList}
              />
            </div>
          </div>
          <p className="text-left text-sm">{shoppingList.description}</p>
        </CardHeader>

        <CardBody className="grid grid-cols-2 gap-4">
          <Button
            size="sm"
            color="success"
            className={shoppingList.items.length > 0 ? "" : "col-span-2"}
            onPress={onOpen}
          >
            Add Items
          </Button>

          <UniversalModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onConfirm={handleSubmit(onAdd)}
            title="Add Items"
            submitColor="success"
          >
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Name"
                  variant="bordered"
                  isRequired
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="quantity"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  value={field.value?.toString() ?? ""}
                  label="Quantity"
                  variant="bordered"
                  isRequired
                  type="number"
                  onChange={(event) => {
                    field.onChange(+event.target.value);
                  }}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="unit"
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  label="Unit"
                  selectedKeys={[field.value]}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  isRequired
                  disallowEmptySelection={true}
                >
                  {[
                    "GRAM",
                    "KILOGRAM",
                    "LITER",
                    "MILLILITER",
                    "TEASPOON",
                    "TABLESPOON",
                    "CUP",
                    "PINCH",
                    "PIECE",
                  ].map((ingredientUnit) => (
                    <SelectItem
                      key={ingredientUnit}
                      value={ingredientUnit as Unit}
                    >
                      {ingredientUnit[0] +
                        ingredientUnit.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </UniversalModal>

          {shoppingList.items.length > 0 ? (
            <>
              <Button
                size="sm"
                color="danger"
                onPress={onDelete}
                isDisabled={selectedIngredients.length === 0}
              >
                Remove Items
              </Button>

              <IngredientTable
                className="col-span-2"
                removeWrapper
                ingredients={shoppingList.items}
                isSelectable={true}
                onSelect={setSelectedIngredients}
              />
            </>
          ) : (
            <p className="col-span-2 text-center text-sm text-foreground-600">
              No items in this shopping list
            </p>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}

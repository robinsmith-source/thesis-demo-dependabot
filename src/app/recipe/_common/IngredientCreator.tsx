import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import {
  Accordion,
  AccordionItem,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import type { Unit } from "@prisma/client";
import { FaMinus } from "react-icons/fa6";

export default function IngredientCreator({
  stepIndex,
}: {
  stepIndex: number;
}) {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `steps.${stepIndex}.ingredients`,
  });

  return (
    <div className="ml-8 space-y-4">
      <Accordion defaultExpandedKeys={["Ingredients"]}>
        <AccordionItem
          key="Ingredients"
          startContent={
            <div className="flex gap-2">
              <h3 className="text-lg">Step Ingredients</h3>
              <Button
                type="button"
                size="sm"
                onClick={() => append({ name: "" })}
              >
                Add Ingredient
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            {fields.map((ingredient, index) => (
              <div key={ingredient.id} className="flex items-center gap-2">
                <Controller
                  control={control}
                  name={`steps.${stepIndex}.ingredients.${index}.name`}
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
                  name={`steps.${stepIndex}.ingredients.${index}.quantity`}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      value={
                        (field.value as string | undefined)?.toString() ?? ""
                      }
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
                  name={`steps.${stepIndex}.ingredients.${index}.unit`}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      label="Unit"
                      variant="bordered"
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

                <Button
                  isIconOnly
                  color="danger"
                  type="button"
                  size="sm"
                  variant="flat"
                  onClick={() => remove(index)}
                >
                  <FaMinus />
                </Button>
              </div>
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

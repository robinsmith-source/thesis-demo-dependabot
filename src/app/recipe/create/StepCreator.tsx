import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import type { RecipeStepType } from "@prisma/client";

import IngredientCreator from "./IngredientCreator";

export default function StepCreator() {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  return (
    <>
      <div className="ml-8 space-y-4">
        <div className="flex gap-2">
          <div className="text-lg">Steps</div>
          <Button
            type="button"
            size="sm"
            onClick={() => append({ description: "" })}
          >
            Add Step
          </Button>
        </div>
        {fields.map((step, index) => (
          <Card key={step.id}>
            <CardBody>
              <div className="grid grid-cols-[4fr_2fr] gap-x-2">
                <Controller
                  control={control}
                  name={`steps.${index}.description`}
                  render={({ field, fieldState }) => (
                    <Textarea
                      className="row-span-2"
                      {...field}
                      label="Step Description"
                      variant="bordered"
                      isRequired
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`steps.${index}.duration`}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      onChange={(event) => {
                        field.onChange(+event.target.value);
                      }}
                      type="number"
                      label="Duration"
                      variant="bordered"
                      isRequired
                      size="sm"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`steps.${index}.stepType`}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      isRequired
                      label="Step Type"
                      variant="bordered"
                      selectedKeys={[field.value]}
                      defaultSelectedKeys={["PREP"]}
                      size="sm"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                    >
                      {["PREP", "COOK", "REST", "SEASON", "SERVE", "MIX"].map(
                        (stepType) => (
                          <SelectItem
                            key={stepType}
                            value={stepType as RecipeStepType}
                            className="capitalize"
                          >
                            {stepType}
                          </SelectItem>
                        ),
                      )}
                    </Select>
                  )}
                />
              </div>
              <div className="flex justify-end py-2">
                <Button
                  className="place-self-stretch"
                  color="danger"
                  type="button"
                  variant="flat"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  Remove Step
                </Button>
              </div>

              <IngredientCreator stepIndex={index} />
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}

import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { RecipeStepType } from "@prisma/client";

import IngredientCreator from "./IngredientCreator";

const StepCreator: React.FC = () => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  return (
    <>
      {fields.map((step, index) => (
        <div key={step.id}>
          <Controller
            control={control}
            name={`steps.${index}.description`}
            render={({ field, fieldState }) => (
              <Textarea {...field} label="Description" />
            )}
          />

          <Controller
            control={control}
            name={`steps.${index}.duration`}
            render={({ field, fieldState }) => (
              <Input {...field} type="number" label="Duration" />
            )}
          />

          <Controller
            control={control}
            name={`steps.${index}.stepType`}
            render={({ field, fieldState }) => (
              <Select
                {...field}
                isRequired
                label="StepType"
                description="Select step type"
                variant="bordered"
                selectedKeys={[field.value]}
                defaultSelectedKeys={["PREP"]}
              >
                {["PREP", "COOK", "REST", "SEASON", "SERVE", "MIX"].map(
                  (stepType) => (
                    <SelectItem
                      key={stepType}
                      value={stepType as RecipeStepType}
                    >
                      {stepType as RecipeStepType}
                    </SelectItem>
                  ),
                )}
              </Select>
            )}
          />
          <IngredientCreator stepIndex={index} />
          <Button type="button" onClick={() => remove(index)}>
            Remove Step
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() =>
          append({ description: "", duration: 0, stepType: "PREP" })
        }
      >
        Add Step
      </Button>
    </>
  );
};

export default StepCreator;

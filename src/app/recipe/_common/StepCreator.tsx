import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import type { RecipeStepType } from "@prisma/client";
import { motion } from "framer-motion";

import IngredientCreator from "./IngredientCreator";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

export default function StepCreator({ className }: { className?: string }) {
  const { control } = useFormContext();
  const { fields, swap, append, remove } = useFieldArray({
    control,
    name: "steps",
  });
  return (
    <div className={`${className} space-y-4`}>
      <div className="flex gap-2">
        <h2 className="text-lg">Steps</h2>
        <Button
          type="button"
          size="sm"
          onPress={() => append({ description: "" })}
        >
          Add Step
        </Button>
      </div>
      {fields.map((step, index) => (
        <motion.div
          key={step.id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", bounce: 0.2 }}
        >
          <Card>
            <CardHeader className="flex justify-between">
              <div className="flex items-start gap-2">
                <Button
                  isDisabled={index === 0}
                  isIconOnly
                  startContent={<FaChevronUp />}
                  size="sm"
                  onPress={() => index > 0 && swap(index, index - 1)}
                />
                <Button
                  isDisabled={index === fields.length - 1}
                  isIconOnly
                  startContent={<FaChevronDown />}
                  size="sm"
                  onPress={() =>
                    index < fields.length - 1 && swap(index, index + 1)
                  }
                />
              </div>

              <Button
                className="place-self-stretch"
                color="danger"
                type="button"
                variant="flat"
                size="sm"
                onPress={() => remove(index)}
              >
                Remove Step
              </Button>
            </CardHeader>
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
                      label="Duration (in minutes)"
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
                      size="sm"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      disallowEmptySelection={true}
                    >
                      {["PREP", "COOK", "REST", "SEASON", "SERVE", "MIX"].map(
                        (stepType) => (
                          <SelectItem
                            key={stepType}
                            value={stepType as RecipeStepType}
                            className="capitalize"
                          >
                            {stepType[0] + stepType.slice(1).toLowerCase()}
                          </SelectItem>
                        ),
                      )}
                    </Select>
                  )}
                />
              </div>
              <Divider className="my-4" />
              <IngredientCreator stepIndex={index} />
            </CardBody>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

"use client";
import {
  Button,
  Divider,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import type {
  Recipe,
  RecipeDifficulty,
  RecipeStep,
  RecipeStepIngredient,
} from "@prisma/client";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import TagInput from "../_common/TagInput";
import ImageUploader from "../_common/ImageUploader";
import StepCreator from "../_common/StepCreator";

export type RecipeFormValues = Recipe & {
  steps: (RecipeStep & {
    ingredients: RecipeStepIngredient[];
  })[];
};

export default function RecipeForm({
  formValue,
  submit,
}: {
  formValue: Partial<RecipeFormValues>;
  submit: (recipeForm: RecipeFormValues) => void;
}) {
  const schema = z.object({
    name: z.string().min(3, "Names must be at least 3 characters long"),
    description: z.string().nullable(),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"]),
    tags: z
      .array(
        z
          .string({ invalid_type_error: "Tags must be strings" })
          .regex(/^[a-z]+$/, "Tags can only contain lowercase characters"),
      )
      .max(10, "A recipe can only have 10 tags")
      .refine((items) => new Set(items).size === items.length, {
        message: "Must be an array of unique strings",
      }),
    images: z.array(z.string()),
    steps: z.array(
      z.object({
        description: z.string().min(3),
        duration: z.number().min(0),
        stepType: z.enum(["PREP", "COOK", "REST", "SEASON", "SERVE", "MIX"], {
          required_error: "Step type is required",
          invalid_type_error: "Invalid step type",
        }),
        ingredients: z.array(
          z.object({
            name: z.string().min(1),
            quantity: z.number().min(1, "Quantity must be at least 1"),
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
          }),
        ),
      }),
    ),
  });

  const methods = useForm<RecipeFormValues>({
    mode: "onTouched",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      difficulty: "EASY",
      images: [],
      tags: [],
      steps: [],
      ...formValue,
    },
  });

  return (
    <FormProvider {...methods}>
      <form>
        <div className="grid grid-cols-2 gap-2">
          <Controller
            control={methods.control}
            name="name"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                isRequired
                label="Recipe name"
                placeholder="My tasty Pizza"
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={methods.control}
            name="difficulty"
            render={({ field, fieldState }) => (
              <Select
                {...field}
                isRequired
                label="Recipe Difficulty"
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                selectedKeys={[field.value]}
                disallowEmptySelection={true}
              >
                {["EASY", "MEDIUM", "HARD", "EXPERT"].map((difficulty) => (
                  <SelectItem
                    key={difficulty}
                    value={difficulty as RecipeDifficulty}
                    className="capitalize"
                  >
                    {difficulty[0] + difficulty.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
          <ImageUploader />
          <Controller
            control={methods.control}
            name="description"
            render={({ fieldState }) => (
              <Textarea
                className={"col-span-full mb-2"}
                minRows={2}
                label="Recipe Description"
                placeholder="My grandma used to make this pizza for me ..."
                {...methods.register("description", { required: false })}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
              />
            )}
          />

          <div className="col-span-2">
            <TagInput />
            <StepCreator className="ml-8 mt-8" />
          </div>
        </div>

        <Divider className="my-4" />
        <Button color="success" onClick={methods.handleSubmit(submit)}>
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}

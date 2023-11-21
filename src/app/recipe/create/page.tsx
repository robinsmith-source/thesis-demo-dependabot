"use client";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import type {
  Recipe,
  RecipeDifficulty,
  RecipeStep,
  RecipeStepIngredient,
} from "@prisma/client";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import TagInput from "./tagInput";
import StepCreator from "./StepCreator";
import { api } from "~/trpc/react";

export default function Page() {
  type RecipeForm = Recipe & {
    steps: (RecipeStep & {
      ingredients: RecipeStepIngredient[];
    })[];
  };

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
    steps: z.array(
      z.object({
        description: z.string().min(3),
        duration: z.number().min(0),
        stepType: z.enum(["PREP", "COOK", "REST", "SEASON", "SERVE", "MIX"]),
        ingredients: z.array(
          z.object({
            name: z.string().min(1),
            quantity: z.number().min(1),
            unit: z
              .enum([
                "GRAM",
                "KILOGRAM",
                "LITER",
                "MILLILITER",
                "TEASPOON",
                "TABLESPOON",
                "CUP",
                "PINCH",
                "PIECE",
              ])
              .nullable(),
          }),
        ),
      }),
    ),
  });

  const methods = useForm<RecipeForm>({
    mode: "onTouched",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      difficulty: "EASY",
      tags: [],
      steps: [],
    },
  });

  const mutation = api.recipe.create.useMutation({
    onSuccess: () => {
      methods.reset({
        name: "",
        description: "",
        difficulty: "EASY",
        tags: [],
        steps: [{ description: "", duration: 0, stepType: "PREP" }],
      });
    },
  });

  const onSubmit = (data: RecipeForm) => {
    mutation.mutate({
      name: data.name,
      description: data.description,
      difficulty: data.difficulty,
      tags: data.tags,
      steps: data.steps.map((step) => ({
        description: step.description,
        duration: step.duration,
        stepType: step.stepType,
        ingredients: step.ingredients.map((ingredient) => ({
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        })),
      })),
    });
  };
  console.log(methods.watch());
  console.log(methods.formState.errors);
  return (
    <>
      <FormProvider {...methods}>
        <form>
          <div className="flex gap-4">
            <Controller
              control={methods.control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  isRequired
                  autoFocus
                  label="Name"
                  description="Enter recipe name"
                  variant="bordered"
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
                  label="Difficulty"
                  description="Select recipe difficulty"
                  variant="bordered"
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  selectedKeys={[field.value]}
                >
                  {["EASY", "MEDIUM", "HARD", "EXPERT"].map((difficulty) => (
                    <SelectItem
                      key={difficulty}
                      value={difficulty as RecipeDifficulty}
                    >
                      {difficulty}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>

          <Controller
            control={methods.control}
            name="description"
            render={({ fieldState }) => (
              <Textarea
                minRows={2}
                label="Description"
                description="Enter recipe description"
                variant="bordered"
                {...methods.register("description", { required: false })}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
              />
            )}
          />

          <TagInput />

          <StepCreator />

          <Button color="primary" onClick={methods.handleSubmit(onSubmit)}>
            Submit
          </Button>
        </form>
      </FormProvider>
    </>
  );
}

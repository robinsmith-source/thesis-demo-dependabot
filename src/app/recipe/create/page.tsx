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

import TagInput from "./tagInput";
import ImageUploader from "./ImageUploader";
import StepCreator from "./StepCreator";
import { api } from "~/trpc/react";
import React from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

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
    images: z.array(z.string()),
    steps: z.array(
      z.object({
        description: z.string().min(3),
        duration: z.number().min(0),
        stepType: z.enum(["PREP", "COOK", "REST", "SEASON", "SERVE", "MIX"]),
        ingredients: z.array(
          z.object({
            name: z.string().min(1),
            quantity: z.number().min(1, "Quantity must be at least 1"),
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
      images: [],
      tags: [],
      steps: [],
    },
  });

  const mutation = api.recipe.create.useMutation({
    onSuccess: (id) => {
      toast.success("Recipe created!");
      router.push(`/recipe/${id}`);
      methods.reset({
        name: "",
        description: "",
        difficulty: "EASY",
        tags: [],
        steps: [],
      });
    },
  });

  const router = useRouter();

  const onSubmit = (data: RecipeForm) => {
    mutation.mutate({
      name: data.name,
      description: data.description,
      difficulty: data.difficulty,
      tags: data.tags,
      images: data.images,
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
  return (
    <>
      <Toaster />
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
            <ImageUploader />
            <Controller
              control={methods.control}
              name="description"
              render={({ fieldState }) => (
                <Textarea
                  className={"col-span-full"}
                  minRows={2}
                  label="Recipe Description"
                  placeholder="My grandma used to make this pizza for me ..."
                  {...methods.register("description", { required: false })}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
          </div>

          <div className="flex flex-col space-y-4">
            <TagInput />
            <StepCreator />
          </div>
          <Divider className="my-4" />
          <Button color="primary" onClick={methods.handleSubmit(onSubmit)}>
            Submit
          </Button>
        </form>
      </FormProvider>
    </>
  );
}

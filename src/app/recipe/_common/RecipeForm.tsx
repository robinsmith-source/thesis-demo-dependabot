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
import { RecipeSchema } from "~/app/lib/schemas";
import TagInput from "../_common/TagInput";
import ImageUploader from "../_common/ImageUploader";
import StepCreator from "../_common/StepCreator";
import toast from "react-hot-toast";
import { useEffect } from "react";

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
  const methods = useForm<RecipeFormValues>({
    mode: "onTouched",
    resolver: zodResolver(RecipeSchema),
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

  useEffect(() => {
    if (methods.formState.errors.steps?.message) {
      toast.error(methods.formState.errors.steps.message.toString());
    }
  }, [methods.formState.errors.steps]);

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
                isRequired
                className={"col-span-full mb-2"}
                minRows={2}
                label="Recipe Description"
                placeholder="My grandma used to make this pizza for me ..."
                {...methods.register("description")}
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
        <Button
          color="success"
          onPress={() => methods.handleSubmit(submit)()}
          isDisabled={!methods.formState.isValid}
        >
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}

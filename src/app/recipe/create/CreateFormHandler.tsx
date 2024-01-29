"use client";

import { api } from "~/trpc/react";
import RecipeForm, { type RecipeFormValues } from "../_common/RecipeForm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { RouterInputs } from "~/trpc/shared";

export default function CreateFormHandler() {
  const router = useRouter();

  const mutation = api.recipe.create.useMutation({
    onSuccess: (id) => {
      toast.success("Recipe created!");
      router.push(`/recipe/${id}`);
      router.refresh();
    },

    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });

  const onSubmit = (data: RecipeFormValues) => {
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
      })) as RouterInputs["recipe"]["create"]["steps"],
    });
  };

  return <RecipeForm submit={onSubmit} formValue={{}} />;
}

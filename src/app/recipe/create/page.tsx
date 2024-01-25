"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import RecipeForm, { type RecipeFormValues } from "../_common/RecipeForm";

export default function RecipeCreate() {
  const router = useRouter();

  const mutation = api.recipe.create.useMutation({
    onSuccess: (id) => {
      toast.success("Recipe created!");
      router.push(`/recipe/${id}`);
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
      })),
    });
  };

  return <RecipeForm submit={onSubmit} formValue={{}} />;
}

"use client";

import { api } from "~/trpc/react";
import RecipeForm, { type RecipeFormValues } from "../../_common/RecipeForm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function FormHandler({ recipe }: { recipe: RecipeFormValues }) {
  const router = useRouter();
  const mutation = api.recipe.updateRecipe.useMutation({
    onSuccess: (id) => {
      toast.success(`Recipe Updated!`);
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
      id: recipe.id,
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

  return <RecipeForm submit={onSubmit} formValue={recipe} />;
}

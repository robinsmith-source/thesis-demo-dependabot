"use client";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import RecipeForm, { type RecipeFormValues } from "../_common/RecipeForm";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import { useSession } from "next-auth/react";

export default function RecipeCreate() {
  const router = useRouter();
  const { data: session } = useSession();

  const mutation = api.recipe.create.useMutation({
    onSuccess: (id) => {
      toast.success("Recipe created!");
      router.push(`/recipe/${id}`);
      revalidatePath(`/user/${session?.user?.id}`);
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

"use client";

import { Button } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";

export default function RecipeSaveButton({
  recipeId,
  isSaved,
  savedCount,
}: {
  recipeId: string;
  isSaved: boolean;
  savedCount: number;
}) {
  const [savedStatus, setSavedStatus] = useState(isSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [saveAdjustment, setSaveAdjustment] = useState(0); // [-1, 0, 1]

  const saveMutation = api.recipe.save.useMutation({
    onSuccess: () => {
      setSavedStatus(true);
      setIsSaving(false);
      setSaveAdjustment(saveAdjustment + 1);
    },
    onError: () => {
      toast.error("Failed to save recipe");
      setIsSaving(false);
    },
  });

  const unsaveMutation = api.recipe.unsave.useMutation({
    onSuccess: () => {
      setSavedStatus(false);
      setIsSaving(false);
      setSaveAdjustment(saveAdjustment - 1);
    },
    onError: () => {
      toast.error("Failed to unsave recipe");
      setIsSaving(false);
    },
  });

  const onPress = () => {
    setIsSaving(true);
    if (savedStatus) {
      unsaveMutation.mutate({
        recipeId,
      });
    } else {
      saveMutation.mutate({
        recipeId,
      });
    }
  };

  return (
    <div className="flex justify-center">
      <Button onPress={onPress} isDisabled={isSaving}>
        {savedStatus ? "Unsave" : "Save"} Recipe ({savedCount + saveAdjustment})
      </Button>
    </div>
  );
}

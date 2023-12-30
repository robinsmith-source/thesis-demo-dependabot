"use client";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ConfirmationModal from "~/app/_components/ConfirmationModal";
import { Button, useDisclosure } from "@nextui-org/react";
import { FaTrash } from "react-icons/fa6";

export default function RecipeDeleteHandler({
  recipeId,
}: {
  recipeId: string;
}) {
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const onDelete = (recipeId: string) => {
    deleteMutation.mutate({
      recipeId,
    });
  };

  const router = useRouter();
  const deleteMutation = api.recipe.delete.useMutation({
    onSuccess: () => {
      toast.success("Recipe deleted");
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error deleting recipe");
    },
  });

  return (
    <>
      <Button isIconOnly color="danger" onPress={onOpen}>
        <FaTrash />
      </Button>
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Delete Recipe"
        body="Are you sure you want to delete this recipe?
This action cannot be undone."
        onConfirm={() => {
          onDelete(recipeId);
          onClose();
        }}
      />
    </>
  );
}

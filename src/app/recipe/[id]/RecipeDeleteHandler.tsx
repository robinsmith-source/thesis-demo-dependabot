"use client";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button, useDisclosure } from "@nextui-org/react";
import { FaTrash } from "react-icons/fa6";
import UniversalModal from "~/app/_components/UniversalModal";

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
      <UniversalModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={() => {
          onDelete(recipeId);
          onClose();
        }}
        title="Delete Recipe"
        submitColor="danger"
      >
        <p>
          Are you sure you want to delete this recipe?
          <br />{" "}
          <span className="font-semibold">This action cannot be undone.</span>
        </p>
      </UniversalModal>
    </>
  );
}

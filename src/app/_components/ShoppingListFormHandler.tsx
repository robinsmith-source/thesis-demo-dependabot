"use client";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { Button, useDisclosure } from "@nextui-org/react";
import ShoppingListFormModal from "~/app/_components/ShoppingListFormModal";
import { FaPenToSquare, FaPlus, FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import ConfirmationModal from "~/app/_components/ConfirmationModal";

export enum Modes {
  CREATE,
  EDIT,
  DELETE,
}

export type ShoppingListFormType = {
  name: string;
  description?: string | null;
};

interface ShoppingListFormHandlerProps {
  mode?: Modes;
  buttonSize?: "sm" | "md" | "lg";
  shoppingList?: {
    id: string;
    name: string;
    description?: string | null;
  } | null;
}

export default function ShoppingListFormHandler({
  mode = Modes.CREATE,
  buttonSize = "md",
  shoppingList,
}: ShoppingListFormHandlerProps) {
  if (mode !== Modes.CREATE && !shoppingList) {
    throw new Error(
      "Shopping list form handler in edit mode requires a shopping list",
    );
  }
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter();

  const onCreate = (data: ShoppingListFormType) => {
    createMutation.mutate({
      name: data.name,
      description: data.description ?? "",
    });
  };

  const createMutation = api.shoppingList.create.useMutation({
    onSuccess: () => {
      toast.success("Shopping list submitted successfully");
      router.refresh();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onEdit = (data: ShoppingListFormType) => {
    if (!shoppingList) {
      throw new Error("No shopping list provided");
    }
    editMutation.mutate({
      shoppingListId: shoppingList.id,
      name: data.name,
      description: data.description ?? "",
    });
  };

  const editMutation = api.shoppingList.update.useMutation({
    onSuccess: () => {
      toast.success("Shopping list edited successfully");
      router.refresh();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDelete = (shoppingListId: string) => {
    deleteMutation.mutate({
      shoppingListId,
    });
  };

  const deleteMutation = api.shoppingList.delete.useMutation({
    onSuccess: () => {
      toast.success("Shopping list deleted");
      router.refresh();
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error deleting shopping list");
    },
  });

  return (
    <>
      {mode === Modes.CREATE && (
        <Button isIconOnly color="success" size={buttonSize} onPress={onOpen}>
          <FaPlus />
        </Button>
      )}

      {mode === Modes.EDIT && (
        <Button isIconOnly color="secondary" size={buttonSize} onPress={onOpen}>
          <FaPenToSquare />
        </Button>
      )}

      {mode === Modes.DELETE && (
        <Button isIconOnly color="danger" size={buttonSize} onPress={onOpen}>
          <FaTrash />
        </Button>
      )}

      {mode !== Modes.DELETE && (
        <ShoppingListFormModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          formValue={
            mode === Modes.EDIT
              ? {
                  id: shoppingList?.id ?? "",
                  name: shoppingList?.name ?? "",
                  description: shoppingList?.description ?? null,
                }
              : null
          }
          submit={mode === Modes.CREATE ? onCreate : onEdit}
        />
      )}
      {mode === Modes.DELETE && (
        <ConfirmationModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title={"Delete Shopping List"}
          body={
            "Are you sure you want to delete this shopping list? This action cannot be undone."
          }
          onConfirm={() => {
            onDelete(shoppingList!.id);
            onClose();
          }}
        />
      )}
    </>
  );
}

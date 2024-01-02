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
    description?: string;
  };
}

export default function ShoppingListFormHandler({
  mode = Modes.CREATE,
  buttonSize = "md",
  shoppingList,
}: ShoppingListFormHandlerProps) {
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
    if (!shoppingList) {
      throw new Error("No shopping list provided");
    }
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
      <ButtonVariants mode={mode} buttonSize={buttonSize} onOpen={onOpen} />
      <Modals
        mode={mode}
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
        onClose={onClose}
        shoppingList={shoppingList}
      />
    </>
  );
}

function ButtonVariants({
  onOpen,
  mode,
  buttonSize,
}: {
  onOpen: () => void;
  mode: Modes;
  buttonSize: "sm" | "md" | "lg";
}) {
  switch (mode) {
    case Modes.CREATE:
      return (
        <Button isIconOnly color="success" size={buttonSize} onPress={onOpen}>
          <FaPlus />
        </Button>
      );
    case Modes.EDIT:
      return (
        <Button isIconOnly color="secondary" size={buttonSize} onPress={onOpen}>
          <FaPenToSquare />
        </Button>
      );
    case Modes.DELETE:
      return (
        <Button isIconOnly color="danger" size={buttonSize} onPress={onOpen}>
          <FaTrash />
        </Button>
      );
    default:
      throw new Error("Invalid mode");
  }
}

function Modals({
  onOpenChange,
  isOpen,
  onClose,
  mode,
  shoppingList,
  onCreate,
  onEdit,
  onDelete,
}: {
  onOpenChange: () => void;
  isOpen: boolean;
  onClose: () => void;
  mode: Modes;
  shoppingList?: {
    id: string;
    name: string;
    description?: string;
  };
  onCreate: (data: ShoppingListFormType) => void;
  onEdit: (data: ShoppingListFormType) => void;
  onDelete: (shoppingListId: string) => void;
}) {
  switch (mode) {
    case Modes.CREATE:
      return (
        <ShoppingListFormModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title="Create Shopping List"
          submit={onCreate}
        />
      );
    case Modes.EDIT:
      if (!shoppingList) {
        throw new Error("No shopping list provided");
      }
      return (
        <ShoppingListFormModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title="Edit Shopping List"
          formValue={{
            ...shoppingList,
          }}
          submit={onEdit}
        />
      );
    case Modes.DELETE:
      if (!shoppingList) {
        throw new Error("No shopping list provided");
      }
      return (
        <ConfirmationModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title="Delete Shopping List"
          body="Are you sure you want to delete this shopping list? 
          This action cannot be undone."
          onConfirm={() => {
            onDelete(shoppingList.id);
            onClose();
          }}
        />
      );
    default:
      throw new Error("Invalid mode");
  }
}

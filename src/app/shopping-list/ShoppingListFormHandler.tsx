"use client";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { Button, Input, Textarea, useDisclosure } from "@nextui-org/react";
import { FaPenToSquare, FaPlus, FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { Modes } from "~/app/lib/shoppingListModes";
import UniversalModal from "~/app/_components/UniversalModal";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type ShoppingListFormType = {
  name: string;
  description?: string | null;
};

type ShoppingListFormHandlerProps = {
  buttonSize?: "sm" | "md" | "lg";
} & (
  | {
      mode: Modes.CREATE;
    }
  | {
      mode: Modes.EDIT;
      shoppingList: {
        id: string;
      } & ShoppingListFormType;
    }
  | {
      mode: Modes.DELETE;
      shoppingList: {
        id: string;
      };
    }
);
export default function ShoppingListFormHandler(
  props: ShoppingListFormHandlerProps,
) {
  const { mode, buttonSize } = props;
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter();

  const schema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
  });

  const { control, handleSubmit, reset } = useForm({
    mode: "onTouched",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      ...(mode === Modes.EDIT && props.shoppingList),
    },
  });

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
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onEdit = (data: ShoppingListFormType) => {
    if (mode === Modes.EDIT && props.shoppingList.id) {
      editMutation.mutate({
        shoppingListId: props.shoppingList.id,
        name: data.name,
        description: data.description ?? "",
      });
    }
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

  switch (mode) {
    case Modes.CREATE:
      return (
        <>
          <Button isIconOnly color="success" size={buttonSize} onPress={onOpen}>
            <FaPlus />
          </Button>

          <UniversalModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onConfirm={handleSubmit(onCreate)}
            title="Create Shopping List"
            submitColor="success"
          >
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Name"
                  placeholder="My shopping list"
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  value={field.value ?? ""}
                />
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  minRows={2}
                  label="Description"
                  placeholder="This is my shopping list"
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  value={field.value ?? ""}
                />
              )}
            />
          </UniversalModal>
        </>
      );
    case Modes.EDIT:
      return (
        <>
          <Button
            isIconOnly
            color="secondary"
            size={buttonSize}
            onPress={onOpen}
          >
            <FaPenToSquare />
          </Button>

          <UniversalModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onConfirm={handleSubmit(onEdit)}
            title="Edit Shopping List"
            submitColor="success"
          >
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Name"
                  placeholder="My shopping list"
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  value={field.value ?? ""}
                />
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  minRows={2}
                  label="Description"
                  placeholder="This is my shopping list"
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  value={field.value ?? ""}
                />
              )}
            />
          </UniversalModal>
        </>
      );
    case Modes.DELETE:
      return (
        <>
          <Button isIconOnly color="danger" size={buttonSize} onPress={onOpen}>
            <FaTrash />
          </Button>

          <UniversalModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onConfirm={() => {
              onDelete(props.shoppingList.id);
              onClose();
            }}
            title="Delete Shopping List"
            submitColor="danger"
          >
            <p>
              Are you sure you want to delete this shopping list?
              <br />{" "}
              <span className="font-semibold">
                This action cannot be undone.
              </span>
            </p>
          </UniversalModal>
        </>
      );
    default:
      throw new Error("Invalid mode");
  }
}

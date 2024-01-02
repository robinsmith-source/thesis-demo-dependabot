"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Input,
} from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ShoppingListFormType } from "~/app/_components/ShoppingListFormHandler";

interface ShoppingListFormModalProps {
  onOpenChange: () => void;
  isOpen: boolean;
  title: string;
  formValue?: {
    id: string;
    name: string;
    description?: string;
  };
  submit: (shoppingListForm: ShoppingListFormType) => void;
}

export default function ShoppingListFormModal({
  onOpenChange,
  isOpen,
  title,
  formValue,
  submit,
}: ShoppingListFormModalProps) {
  const schema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
  });

  const { control, handleSubmit } = useForm({
    mode: "onTouched",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      ...formValue,
    },
  });
  console.log("title", title);
  console.log("formvalue", formValue);
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3>{title}</h3>
              </ModalHeader>
              <ModalBody>
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
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="success" onClick={handleSubmit(submit)}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

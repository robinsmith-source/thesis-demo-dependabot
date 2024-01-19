"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import type { ReactNode } from "react";

interface UniversalModalProps {
  className?: string;
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
  submitText?: string;
  submitColor?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
  cancelText?: string;
}

export default function UniversalModal({
  className,
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  children,
  submitText = "Submit",
  submitColor = "default",
  cancelText = "Cancel",
}: UniversalModalProps) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        className={className}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2>{title}</h2>
              </ModalHeader>
              <ModalBody>{children}</ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {cancelText}
                </Button>
                <Button color={submitColor} onPress={onConfirm}>
                  {submitText}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

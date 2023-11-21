import { Chip, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

export default function TagInput() {
  const methods = useFormContext();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "tags",
  });
  const fieldState = methods.getFieldState("tags");

  const [inputValue, setInputValue] = useState<string>("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === " " || event.key === ",") {
      event.preventDefault();
      addTag();
    }
    if (event.key === "Backspace" && inputValue === "" && fields.length > 0) {
      remove(fields.length - 1);
    }
  };

  const addTag = () => {
    if (inputValue.trim() !== "") {
      append(inputValue.trim());
      setInputValue("");
    }
  };

  const handleClose = (tagToRemove: number) => {
    remove(tagToRemove);
  };

  useEffect(() => {
    if (Array.isArray(fieldState.error)) {
      setErrorMessage(fieldState.error?.find((e) => !!e)?.message || "");
    } else if (fieldState.error) {
      setErrorMessage(fieldState.error?.message || "");
    } else setErrorMessage("");
  }, [fieldState.error]);

  return (
    <Controller
      control={methods.control}
      name="tags"
      render={() => (
        <Input
          type="text"
          label="Tags"
          labelPlacement="outside"
          size="lg"
          className="mb-2"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          isInvalid={!!fieldState?.invalid}
          errorMessage={errorMessage}
          variant="bordered"
          startContent={
            fields && (
              <div className="flex items-center gap-2">
                {fields.map((field, index) => (
                  <Chip
                    {...field}
                    key={field.id}
                    onClose={() => handleClose(index)}
                    color="secondary"
                    variant="faded"
                  >
                    {methods.getValues(`tags.${index}`)}
                  </Chip>
                ))}
              </div>
            )
          }
          endContent={fields.length}
          placeholder={
            fields.length === 0 ? "Enter tags, separated by comma" : ""
          }
        />
      )}
    />
  );
}

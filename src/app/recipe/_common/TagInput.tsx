import { Chip, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

export default function TagInput() {
  const { control, getValues, getFieldState } = useFormContext();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "tags",
  });
  const fieldState = getFieldState("tags");

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
    if (inputValue.trim() !== "" && fields.length < 10) {
      append(inputValue.trim());
      setInputValue("");
    }
  };

  const handleClose = (tagToRemove: number) => {
    remove(tagToRemove);
  };

  useEffect(() => {
    if (Array.isArray(fieldState.error)) {
      // eslint-disable-next-line
      setErrorMessage(fieldState.error?.find((e) => !!e)?.message ?? "");
    } else if (fieldState.error) {
      setErrorMessage(fieldState.error?.message ?? "");
    } else setErrorMessage("");
  }, [fieldState.error]);

  return (
    <Controller
      control={control}
      name="tags"
      render={() => (
        <Input
          type="text"
          label={`Recipe Tags (${fields.length}/10)`}
          size="lg"
          className="mb-2"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          isInvalid={!!fieldState?.invalid}
          errorMessage={errorMessage}
          startContent={
            fields && fields.length !== 0 ? (
              <div className="flex items-center gap-2">
                {fields.map((field, index) => (
                  <Chip
                    {...field}
                    key={field.id}
                    onClose={() => handleClose(index)}
                    color="secondary"
                    variant="faded"
                    size="sm"
                  >
                    {getValues(`tags.${index}`)}
                  </Chip>
                ))}
              </div>
            ) : null
          }
          description="Enter tags, separated by comma"
        />
      )}
    />
  );
}

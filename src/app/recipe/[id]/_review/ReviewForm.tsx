"use client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Textarea,
} from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RatingInput from "./RatingInput";
import { CardHeader } from "@nextui-org/card";
import type { RecipeReview } from ".prisma/client";

export default function ReviewForm({
  formValue,
  submit,
}: {
  formValue: Partial<RecipeReview>;
  submit: (recipeForm: { rating: number; comment: string | null }) => void;
}) {
  const schema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string(),
  });

  const { control, handleSubmit } = useForm({
    mode: "onTouched",
    resolver: zodResolver(schema),
    defaultValues: {
      rating: 3,
      comment: "",
      ...formValue,
    },
  });

  return (
    <Card className="w-[36rem]">
      <CardHeader className="-mb-4">
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <RatingInput
              value={field.value}
              onChange={(newValue: number) => field.onChange(newValue)}
            />
          )}
        />
      </CardHeader>
      <CardBody>
        <Controller
          control={control}
          name="comment"
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              minRows={3}
              label="Comment"
              placeholder="I really liked this recipe!"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              value={field.value ?? ""}
            />
          )}
        />
      </CardBody>
      <CardFooter className="-mt-4 flex justify-end">
        <Button color="success" onClick={handleSubmit(submit)}>
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}

"use client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Textarea,
} from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import React from "react";
import { z } from "zod";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import RatingInput from "./RatingInput";
import { CardHeader } from "@nextui-org/card";

export default function ReviewCreator({ recipeId }: { recipeId: string }) {
  const schema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string(),
  });

  const { control, handleSubmit, reset } = useForm({
    mode: "onTouched",
    resolver: zodResolver(schema),
    defaultValues: {
      rating: 1,
      comment: "",
    },
  });

  const router = useRouter();
  const mutation = api.review.create.useMutation({
    onSuccess: () => {
      toast.success("Review created!");
      reset({
        rating: 1,
        comment: "",
      });
      router.refresh();
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });

  const onSubmit = (data: { rating: number; comment: string }) => {
    mutation.mutate({
      rating: data.rating,
      comment: data.comment,
      recipeId: recipeId,
    });
  };

  return (
    <Card>
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
            />
          )}
        />
      </CardBody>
      <CardFooter className="-mt-4 flex justify-end">
        <Button color="primary" onClick={handleSubmit(onSubmit)}>
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}

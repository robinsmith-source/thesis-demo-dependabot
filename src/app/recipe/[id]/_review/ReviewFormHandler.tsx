"use client";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import ReviewForm from "./ReviewForm";
import ReviewCard from "./ReviewCard";
import { AnimatePresence, motion } from "framer-motion";
import ConfirmationModal from "~/app/_components/ConfirmationModal";
import { useDisclosure } from "@nextui-org/react";

enum Modes {
  CREATE,
  EDIT,
  VIEW,
}

export default function ReviewFormHandler({
  recipeId,
  myReviewQuery,
}: {
  recipeId: string;
  myReviewQuery: {
    id: string;
    rating: number;
    comment: string | null;
  } | null;
}) {
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const [mode, setMode] = useState<Modes>();
  const [submittedReview, setSubmittedReview] = useState<{
    id: string;
    rating: number;
    comment: string | null;
  } | null>(null);

  useEffect(() => {
    if (myReviewQuery) {
      setMode(Modes.VIEW);
      setSubmittedReview({
        id: myReviewQuery.id,
        rating: myReviewQuery.rating,
        comment: myReviewQuery.comment,
      });
    } else {
      setMode(Modes.CREATE);
    }
  }, [myReviewQuery]);

  const onCreate = (data: { rating: number; comment: string | null }) => {
    createMutation.mutate({
      rating: data.rating,
      comment: data.comment ?? "",
      recipeId: recipeId,
    });
  };

  const createMutation = api.review.create.useMutation({
    onSuccess: (data) => {
      toast.success("Review submitted successfully");
      setSubmittedReview({
        id: data.id,
        rating: data.rating,
        comment: data.comment,
      });
      setMode(Modes.VIEW);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onEdit = (data: {
    reviewId: string;
    rating: number;
    comment: string | null;
  }) => {
    editMutation.mutate({
      reviewId: data.reviewId,
      rating: data.rating,
      comment: data.comment ?? "",
    });
  };

  const editMutation = api.review.update.useMutation({
    onSuccess: (data) => {
      toast.success("Review edited successfully");
      setSubmittedReview({
        id: data.id,
        rating: data.rating,
        comment: data.comment,
      });
      setMode(Modes.VIEW);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDelete = (reviewId: string) => {
    deleteMutation.mutate({
      reviewId,
    });
  };

  const deleteMutation = api.review.delete.useMutation({
    onSuccess: () => {
      toast.success("Review deleted successfully");
      setSubmittedReview(null);
      setMode(Modes.CREATE);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const motionConfig = {
    transition: {
      type: "spring",
      bounce: 0.2,
      duration: 0.2,
    },
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {mode === Modes.CREATE && (
          <motion.div
            layout
            layoutId="reviewCard"
            transition={motionConfig.transition}
          >
            <ReviewForm submit={onCreate} formValue={{}} />
          </motion.div>
        )}
        {mode === Modes.EDIT && submittedReview && (
          <motion.div
            layout
            layoutId="reviewCard"
            transition={motionConfig.transition}
          >
            <ReviewForm
              submit={(data) =>
                onEdit({ ...data, reviewId: submittedReview.id })
              }
              formValue={submittedReview}
            />
          </motion.div>
        )}
        {mode === Modes.VIEW && submittedReview && (
          <motion.div
            layoutId="reviewCard"
            layout
            transition={motionConfig.transition}
          >
            <ReviewCard
              review={submittedReview}
              handleEditClick={() => {
                setMode(Modes.EDIT);
              }}
              handleDeleteClick={() => {
                onOpen();
              }}
            />
            <ConfirmationModal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              title="Delete Review"
              body="Are you sure you want to delete this review?
This action cannot be undone."
              onConfirm={() => {
                onDelete(submittedReview.id);
                onClose();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

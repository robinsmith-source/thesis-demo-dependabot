import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Progress,
} from "@nextui-org/react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useDropzone } from "@uploadthing/react/hooks";
import { useUploadThing } from "~/app/lib/uploadthing";
import { useCallback, useState } from "react";
import type { SetStateAction } from "react";
import { FaCircleXmark, FaCloudArrowUp } from "react-icons/fa6";
import { api } from "~/trpc/react";
import { CardHeader } from "@nextui-org/card";
import toast from "react-hot-toast";

export default function ImageUploader() {
  const { control, getValues } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "images",
  });

  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: SetStateAction<File[]>) => {
    setFiles(acceptedFiles);
  }, []);

  const { startUpload, isUploading, permittedFileInfo } = useUploadThing(
    "recipeImagesUploader",
    {
      onClientUploadComplete: (res) => {
        res.forEach((file) => {
          append(file.key);
        });
        setFiles([]);
        toast.success("Upload completed", {
          id: "imageUpload",
        });
      },
      onUploadError: () => {
        toast.error("Error occurred while uploading", {
          id: "imageUpload",
        });
      },
      onUploadBegin: () => {
        toast.loading("Upload has begun", {
          id: "imageUpload",
        });
      },
    },
  );

  const mutation = api.recipe.deleteRecipeImage.useMutation();
  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <Card className="col-span-2 shadow-sm">
      {isUploading && (
        <CardHeader>
          <Progress isIndeterminate aria-label="Loading..." />
        </CardHeader>
      )}
      <CardBody className="h-64 bg-default-100 p-4">
        <div
          {...getRootProps()}
          className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary"
        >
          <input {...getInputProps()} />
          <p className="flex flex-col items-center">
            <FaCloudArrowUp size={50} className="mb-4" />
            <span className="font-semibold">Choose files or drag and drop</span>
            <span className="text-xs font-light">(Image 4MB)</span>
          </p>
          <Button
            isDisabled={files.length === 0}
            onPress={() => startUpload(files)}
            className={`mt-4 ${
              files.length === 0 ? "opacity-0" : "opacity-100"
            }`}
            color="success"
          >
            {files.length === 0
              ? "Select Files"
              : files.length === 1
                ? `Upload ${files.length} selected file`
                : `Upload ${files.length} selected files`}
          </Button>
        </div>
      </CardBody>
      {fields.length > 0 && (
        <CardFooter className="bg-default-100">
          <div className="flex flex-wrap justify-center gap-2 p-1">
            {fields.map((image, index) => (
              <div
                className="group relative grid place-items-center overflow-hidden rounded-large"
                key={image.id}
              >
                <Image
                  className="aspect-video w-64 object-cover transition group-hover:scale-110"
                  alt={`Recipe image ${index}`}
                  src={`https://utfs.io/f/${getValues(`images.${index}`)}`}
                />

                <div className="absolute inset-0 z-10 grid place-items-center bg-black/20 text-white opacity-0 transition focus-within:opacity-100 hover:opacity-100">
                  <Button
                    isIconOnly
                    onPress={() => {
                      mutation.mutate({
                        key: getValues(`images.${index}`) as string,
                      });
                      remove(index);
                    }}
                  >
                    <FaCircleXmark />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

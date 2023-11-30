import { Button, Card, CardBody, Image } from "@nextui-org/react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { UploadDropzone } from "~/utils/uploadthing";
import { FaCircleXmark } from "react-icons/fa6";
import { api } from "~/trpc/react";

export default function ImageUploader() {
  const { control, watch, getValues } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "images",
  });
  const mutation = api.recipe.deleteRecipeImage.useMutation();

  console.log(watch());

  return (
    <Card className="col-span-2">
      <CardBody>
        <UploadDropzone
          endpoint="recipeImagesUploader"
          onClientUploadComplete={(res) => {
            res.forEach((file) => {
              console.log(file);
              append(file.key);
            });
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />
        <div className="flex gap-2">
          {fields.map((image, index) => (
            <div
              className="group relative grid h-24 w-24 place-items-center overflow-hidden rounded-large bg-black/10 p-1"
              key={image.id}
            >
              <Image
                height={100}
                width={100}
                alt={`Recipe image ${index}`}
                src={`https://utfs.io/f/${getValues(`images.${index}`)}`}
              />

              <div className="absolute inset-0 z-10 grid place-items-center bg-black/20 text-white opacity-0 transition focus-within:opacity-100 hover:opacity-100">
                <Button
                  isIconOnly
                  onClick={() => {
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
      </CardBody>
    </Card>
  );
}

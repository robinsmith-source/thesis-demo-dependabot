import { generateReactHelpers } from "@uploadthing/react/hooks";
import { chefFileRouter } from "~/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<typeof chefFileRouter>();

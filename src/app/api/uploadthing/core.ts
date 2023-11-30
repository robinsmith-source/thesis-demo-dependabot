import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerAuthSession } from "~/server/auth";

const f = createUploadthing();

export const chefFileRouter = {
  recipeImagesUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const session = await getServerAuthSession();

      if (!session?.user) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type ChefFileRouter = typeof chefFileRouter;

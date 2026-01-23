import { addRecord } from "@/actions/recordActions";
import { auth } from "@/lib/auth";
import { createRecordFormSchema } from "@/lib/zodSchemas";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import z from "zod";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  recordUploader: f({
    pdf: { maxFileSize: "16MB" },
    image: { maxFileSize: "8MB" },
    video: { maxFileSize: "128MB" },
    audio: { maxFileSize: "8MB" },
    blob: { maxFileSize: "64MB" },
  })
    .input(z.object({ values: createRecordFormSchema }))
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      const { userId, role } = await auth();

      // If you throw, the user will not be able to upload
      if (!userId) throw new UploadThingError("Unauthorized");

      if (role !== "SENDER") throw new UploadThingError("Forbidden");

      const inputValidation = createRecordFormSchema.safeParse(input.values);
      if (!inputValidation.success) {
        throw new UploadThingError(inputValidation.error.issues[0].message);
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId, role, input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      await addRecord(
        metadata.input.values,
        file,
        metadata.userId,
        metadata.role,
      );

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

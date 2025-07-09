import { generateReactHelpers } from "@uploadthing/react";

import type { uploadthingRouter } from "@/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<uploadthingRouter>();

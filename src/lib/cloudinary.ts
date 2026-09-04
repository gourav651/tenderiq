import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadFileOptions {
  folder?: string;
  allowedFormats?: string[];
  maxSizeBytes?: number;
}

export class CloudinaryService {
  /**
   * Uploads a file buffer or base64 data to Cloudinary.
   */
  static async uploadBuffer(
    buffer: Buffer,
    fileName: string,
    options: UploadFileOptions = {}
  ): Promise<UploadApiResponse> {
    const folder = options.folder || "tenderiq/documents";

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          public_id: `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Cloudinary upload failed"));
          }
          resolve(result);
        }
      );

      uploadStream.end(buffer);
    });
  }
}

export { cloudinary };

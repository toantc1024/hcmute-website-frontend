import axios from "axios";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/api-client";
import type {
  PresignedUploadRequest,
  PresignedUrlDto,
  PresignedUploadBatchRequest,
  PresignedUrlBatchDto,
  ConfirmUploadRequest,
  ConfirmUploadBatchRequest,
  FileDto,
} from "../types";

async function computeChecksum(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const filesApi = {
  getPresignedUploadUrl: async (
    data: PresignedUploadRequest,
  ): Promise<PresignedUrlDto> => {
    const response = await apiClient.post<ApiResponse<PresignedUrlDto>>(
      "/api/v1/files/presigned-upload-url",
      data,
    );

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to get presigned URL");
    }

    return response.data.data;
  },

  getPresignedUploadUrlBatch: async (
    data: PresignedUploadBatchRequest,
  ): Promise<PresignedUrlBatchDto> => {
    const response = await apiClient.post<ApiResponse<PresignedUrlBatchDto>>(
      "/api/v1/files/presigned-upload-url/batch",
      data,
    );

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to get presigned URLs");
    }

    return response.data.data;
  },

  confirmUpload: async (data: ConfirmUploadRequest): Promise<FileDto> => {
    const response = await apiClient.post<ApiResponse<FileDto>>(
      "/api/v1/files/confirm-upload",
      data,
    );

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to confirm upload");
    }

    return response.data.data;
  },

  confirmUploadBatch: async (
    data: ConfirmUploadBatchRequest,
  ): Promise<FileDto[]> => {
    const response = await apiClient.post<ApiResponse<FileDto[]>>(
      "/api/v1/files/confirm-upload/batch",
      data,
    );

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to confirm uploads");
    }

    return response.data.data;
  },

  uploadFile: async (file: File): Promise<FileDto> => {
    const presigned = await filesApi.getPresignedUploadUrl({
      fileName: file.name,
      fileSize: file.size,
    });

    await axios.put(presigned.url, file, {
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
    });

    const checksum = await computeChecksum(file);

    return filesApi.confirmUpload({
      tempPath: presigned.tempPath,
      checksum,
    });
  },

  uploadFiles: async (files: File[]): Promise<FileDto[]> => {
    const presignedBatch = await filesApi.getPresignedUploadUrlBatch({
      files: files.map((file) => ({
        fileName: file.name,
        fileSize: file.size,
      })),
    });

    await Promise.all(
      presignedBatch.items.map((presigned, index) =>
        axios.put(presigned.url, files[index], {
          headers: {
            "Content-Type": files[index].type || "application/octet-stream",
          },
        }),
      ),
    );

    const confirmItems = await Promise.all(
      presignedBatch.items.map(async (presigned, index) => ({
        tempPath: presigned.tempPath,
        checksum: await computeChecksum(files[index]),
      })),
    );

    return filesApi.confirmUploadBatch({ items: confirmItems });
  },

  getPresignedDownloadUrl: async (fileId: string): Promise<PresignedUrlDto> => {
    const response = await apiClient.get<ApiResponse<PresignedUrlDto>>(
      `/api/v1/files/${fileId}/presigned-download-url`,
    );

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to get download URL");
    }

    return response.data.data;
  },

  getPresignedDownloadUrlBatch: async (
    ids: string[],
  ): Promise<PresignedUrlBatchDto> => {
    const response = await apiClient.post<ApiResponse<PresignedUrlBatchDto>>(
      "/api/v1/files/presigned-download-url/batch",
      { ids },
    );

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to get download URLs");
    }

    return response.data.data;
  },

  getAdminFiles: async (
    params: { cursor?: string; size?: number } = {},
  ): Promise<FileDto[]> => {
    const searchParams = new URLSearchParams();
    if (params.cursor) searchParams.append("cursor", params.cursor);
    if (params.size) searchParams.append("size", String(params.size));

    const queryString = searchParams.toString();
    const url = queryString
      ? `/api/v1/admin/files?${queryString}`
      : "/api/v1/admin/files";

    const response =
      await apiClient.get<ApiResponse<{ content: FileDto[] } | FileDto[]>>(url);

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to fetch files");
    }

    const data = response.data.data;
    if (Array.isArray(data)) {
      return data;
    }
    return data.content || [];
  },

  getFileById: async (fileId: string): Promise<FileDto> => {
    const response = await apiClient.get<ApiResponse<FileDto>>(
      `/api/v1/admin/files/${fileId}`,
    );

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to fetch file");
    }

    return response.data.data;
  },

  deleteFile: async (fileId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/admin/files/${fileId}`,
    );

    if (!response.data.result) {
      throw new Error(response.data.message || "Failed to delete file");
    }
  },
};

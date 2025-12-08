import { apiClient } from "@/lib/apiClient";
import type { ResponseWrapper } from "@/types/partner";

interface UploadAvatarResponse {
  url: string;
}

export async function uploadPartnerAvatar(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post<ResponseWrapper<UploadAvatarResponse>>(
    "/api/v1/uploads/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.data.url;
}

export async function uploadEventBanner(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post<ResponseWrapper<UploadUrlResponse>>("/api/v1/uploads/event-banner", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data.url;
}

interface UploadUrlResponse {
  url: string;
}

export async function uploadCourseThumbnail(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post<ResponseWrapper<UploadUrlResponse>>(
    "/api/v1/uploads/course-thumbnail",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.data.url;
}

export async function uploadCourseVideo(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post<ResponseWrapper<UploadUrlResponse>>(
    "/api/v1/uploads/course-video",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.data.url;
}

export async function uploadCourseMaterial(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post<ResponseWrapper<UploadUrlResponse>>(
    "/api/v1/uploads/course-material",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.data.url;
}

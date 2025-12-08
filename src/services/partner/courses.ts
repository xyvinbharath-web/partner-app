import { apiClient } from "@/lib/apiClient";
import type { ResponseWrapper } from "@/types/partner";

export interface PartnerCourse {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  thumbnailUrl?: string;
  introVideoUrl?: string;
  published?: boolean;
  isCertificateCourse?: boolean;
  viewsTotal?: number;
  viewsPaidOnly?: number;
  partnerEarnings?: number;
}

export interface PlaylistVideo {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  order?: number;
}

export interface PlaylistMaterial {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  order?: number;
}

export interface CoursePlaylist {
  _id: string;
  title: string;
  description?: string;
  order?: number;
  videos: PlaylistVideo[];
  materials: PlaylistMaterial[];
}

export async function getPartnerCourses(): Promise<PartnerCourse[]> {
  const res = await apiClient.get<ResponseWrapper<PartnerCourse[]>>(
    "/api/v1/partner/courses"
  );
  return res.data.data;
}

export interface CreateCoursePayload {
  title: string;
  description?: string;
  category?: string;
  price?: number;
  thumbnailUrl?: string;
  introVideoUrl?: string;
  isCertificateCourse?: boolean;
}

export async function createPartnerCourse(
  payload: CreateCoursePayload
): Promise<PartnerCourse> {
  const res = await apiClient.post<ResponseWrapper<PartnerCourse>>(
    "/api/v1/partner/courses",
    payload
  );
  return res.data.data;
}

export interface UpdateCoursePayload extends Partial<CreateCoursePayload> {}

export async function updatePartnerCourse(
  id: string,
  payload: UpdateCoursePayload
): Promise<PartnerCourse> {
  const res = await apiClient.put<ResponseWrapper<PartnerCourse>>(
    `/api/v1/partner/courses/${id}`,
    payload
  );
  return res.data.data;
}

export async function getCoursePlaylist(
  courseId: string
): Promise<CoursePlaylist | null> {
  const res = await apiClient.get<ResponseWrapper<CoursePlaylist | null>>(
    `/api/v1/partner/courses/${courseId}/playlist`
  );
  return res.data.data;
}

export interface SavePlaylistPayload {
  title: string;
  description?: string;
  order?: number;
}

export async function saveCoursePlaylist(
  courseId: string,
  payload: SavePlaylistPayload
): Promise<CoursePlaylist> {
  const res = await apiClient.put<ResponseWrapper<CoursePlaylist>>(
    `/api/v1/partner/courses/${courseId}/playlist`,
    payload
  );
  return res.data.data;
}

export interface SavePlaylistVideoPayload {
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  order?: number;
}

export async function addPlaylistVideo(
  courseId: string,
  payload: SavePlaylistVideoPayload
): Promise<PlaylistVideo> {
  const res = await apiClient.post<ResponseWrapper<PlaylistVideo>>(
    `/api/v1/partner/courses/${courseId}/playlist/videos`,
    payload
  );
  return res.data.data;
}

export async function updatePlaylistVideo(
  courseId: string,
  videoId: string,
  payload: Partial<SavePlaylistVideoPayload>
): Promise<PlaylistVideo> {
  const res = await apiClient.put<ResponseWrapper<PlaylistVideo>>(
    `/api/v1/partner/courses/${courseId}/playlist/videos/${videoId}`,
    payload
  );
  return res.data.data;
}

export async function deletePlaylistVideo(
  courseId: string,
  videoId: string
): Promise<void> {
  await apiClient.delete<ResponseWrapper<null>>(
    `/api/v1/partner/courses/${courseId}/playlist/videos/${videoId}`
  );
}

export interface SavePlaylistMaterialPayload {
  title: string;
  description?: string;
  fileUrl: string;
  order?: number;
}

export async function addPlaylistMaterial(
  courseId: string,
  payload: SavePlaylistMaterialPayload
): Promise<PlaylistMaterial> {
  const res = await apiClient.post<ResponseWrapper<PlaylistMaterial>>(
    `/api/v1/partner/courses/${courseId}/playlist/materials`,
    payload
  );
  return res.data.data;
}

export async function updatePlaylistMaterial(
  courseId: string,
  materialId: string,
  payload: Partial<SavePlaylistMaterialPayload>
): Promise<PlaylistMaterial> {
  const res = await apiClient.put<ResponseWrapper<PlaylistMaterial>>(
    `/api/v1/partner/courses/${courseId}/playlist/materials/${materialId}`,
    payload
  );
  return res.data.data;
}

export async function deletePlaylistMaterial(
  courseId: string,
  materialId: string
): Promise<void> {
  await apiClient.delete<ResponseWrapper<null>>(
    `/api/v1/partner/courses/${courseId}/playlist/materials/${materialId}`
  );
}

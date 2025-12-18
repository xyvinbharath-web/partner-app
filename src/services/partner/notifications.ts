import { apiClient } from "@/lib/apiClient";
import type { PaginatedResponse, PartnerNotification, ResponseWrapper } from "@/types/partner";

export interface PartnerNotificationsQuery {
  page?: number;
  limit?: number;
  read?: "all" | "unread" | "read";
}

export async function getPartnerNotifications(
  params: PartnerNotificationsQuery
): Promise<PaginatedResponse<PartnerNotification>> {
  const res = await apiClient.get<
    ResponseWrapper<PaginatedResponse<PartnerNotification>>
  >("/api/v1/notifications", { params });
  return res.data.data;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await apiClient.patch(`/api/v1/notifications/${id}/read`);
}

export async function markNotificationAsUnread(id: string): Promise<void> {
  await apiClient.post(`/api/v1/notifications/${id}/unread`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.patch("/api/v1/notifications/read-all");
}

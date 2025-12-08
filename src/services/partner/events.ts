import { apiClient } from "@/lib/apiClient";
import type { PaginatedResponse, PartnerEvent, ResponseWrapper } from "@/types/partner";

export interface PartnerEventsQuery {
  page?: number;
  limit?: number;
  q?: string;
  status?: "draft" | "published" | "completed" | "canceled" | "";
}

export interface PartnerEventPayload {
  title: string;
  description?: string;
  // Event start/end datetimes
  startsAt: string;
  endsAt?: string;
  capacity?: number;
  // Optional booking window
  bookingOpensAt?: string;
  bookingClosesAt?: string;
  // Optional pricing
  isFree?: boolean;
  price?: number;
  // Optional banner image URL
  bannerUrl?: string;
}

export interface PartnerEventWithAnalytics extends PartnerEvent {
  views?: number;
  bookingsCount?: number;
  revenue?: number;
}

export async function getPartnerEvents(
  params: PartnerEventsQuery
): Promise<PaginatedResponse<PartnerEvent>> {
  const res = await apiClient.get<ResponseWrapper<PaginatedResponse<PartnerEvent>>>(
    "/api/v1/partner/events",
    { params }
  );
  return res.data.data;
}

export async function getPartnerEvent(id: string): Promise<PartnerEventWithAnalytics> {
  const res = await apiClient.get<ResponseWrapper<PartnerEventWithAnalytics>>(
    `/api/v1/partner/events/${id}`
  );
  return res.data.data;
}

export async function createPartnerEvent(
  payload: PartnerEventPayload
): Promise<PartnerEvent> {
  const res = await apiClient.post<ResponseWrapper<PartnerEvent>>(
    "/api/v1/partner/events",
    payload
  );
  return res.data.data;
}

export async function updatePartnerEvent(
  id: string,
  payload: Partial<PartnerEventPayload>
): Promise<PartnerEvent> {
  const res = await apiClient.patch<ResponseWrapper<PartnerEvent>>(
    `/api/v1/partner/events/${id}`,
    payload
  );
  return res.data.data;
}

export async function deletePartnerEvent(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/partner/events/${id}`);
}

export async function approveEventBooking(
  eventId: string,
  bookingId: string
): Promise<void> {
  await apiClient.post(`/api/v1/partner/events/${eventId}/bookings/${bookingId}/approve`);
}

export async function rejectEventBooking(
  eventId: string,
  bookingId: string
): Promise<void> {
  await apiClient.post(`/api/v1/partner/events/${eventId}/bookings/${bookingId}/reject`);
}

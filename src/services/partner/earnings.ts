import { apiClient } from "@/lib/apiClient";
import type { PartnerEarnings, PaginatedResponse, PartnerTransaction, ResponseWrapper } from "@/types/partner";

export interface PartnerPayoutsQuery {
  page?: number;
  limit?: number;
}

export async function getPartnerEarnings(): Promise<PartnerEarnings> {
  const res = await apiClient.get<ResponseWrapper<PartnerEarnings>>(
    "/api/v1/partner/earnings"
  );
  return res.data.data;
}

export async function getPartnerPayoutHistory(
  params: PartnerPayoutsQuery
): Promise<PaginatedResponse<PartnerTransaction>> {
  const res = await apiClient.get<
    ResponseWrapper<PaginatedResponse<PartnerTransaction>>
  >("/api/v1/partner/earnings/payouts", { params });
  return res.data.data;
}

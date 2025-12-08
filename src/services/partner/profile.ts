import { apiClient } from "@/lib/apiClient";
import type { PartnerUser, ResponseWrapper } from "@/types/partner";

export interface UpdatePartnerProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface UpdatePartnerPasswordInput {
  currentPassword: string;
  newPassword: string;
}

export async function getPartnerProfile(): Promise<PartnerUser> {
  const res = await apiClient.get<ResponseWrapper<PartnerUser>>(
    "/api/v1/partner/profile"
  );
  return res.data.data;
}

export async function updatePartnerProfile(
  input: UpdatePartnerProfileInput
): Promise<PartnerUser> {
  const res = await apiClient.patch<ResponseWrapper<PartnerUser>>(
    "/api/v1/partner/profile",
    input
  );
  return res.data.data;
}

export async function updatePartnerPassword(
  input: UpdatePartnerPasswordInput
): Promise<void> {
  await apiClient.patch("/api/v1/partner/profile/password", input);
}

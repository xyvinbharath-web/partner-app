import { apiClient, setPartnerToken } from "@/lib/apiClient";
import type { PartnerUser, ResponseWrapper } from "@/types/partner";

function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("+")) return trimmed;
  // Default to India country code if missing
  if (trimmed.startsWith("0")) {
    return `+91${trimmed.slice(1)}`;
  }
  return `+91${trimmed}`;
}

export interface AuthResponseData {
  user: PartnerUser;
  accessToken: string;
  refreshToken?: string;
}

export interface PartnerLoginPayload {
  phone: string;
  password: string;
}

export interface PartnerResetOtpPayload {
  phone: string;
  code: string;
  newPassword: string;
}

export interface PartnerRegisterOtpPayload {
  phone: string;
  code: string;
}

export async function partnerLogin(
  payload: PartnerLoginPayload
): Promise<AuthResponseData> {
  const normalized = { ...payload, phone: normalizePhone(payload.phone) };
  const res = await apiClient.post<ResponseWrapper<AuthResponseData>>(
    "/api/v1/auth/login",
    normalized
  );
  const data = res.data.data;
  if (data.accessToken) {
    setPartnerToken(data.accessToken);
  }
  return data;
}

export async function partnerSendRegisterOtp(phone: string): Promise<void> {
  await apiClient.post<ResponseWrapper<null>>("/api/v1/auth/send-register-otp", {
    phone: normalizePhone(phone),
  });
}

export async function partnerVerifyRegisterOtp(
  payload: PartnerRegisterOtpPayload
): Promise<AuthResponseData> {
  const normalized = { ...payload, phone: normalizePhone(payload.phone) };
  const res = await apiClient.post<ResponseWrapper<AuthResponseData>>(
    "/api/v1/auth/verify-register-otp",
    normalized
  );
  const data = res.data.data;
  if (data.accessToken) {
    setPartnerToken(data.accessToken);
  }
  return data;
}

export async function partnerSendResetOtp(phone: string): Promise<void> {
  await apiClient.post<ResponseWrapper<null>>("/api/v1/auth/send-reset-otp", {
    phone: normalizePhone(phone),
  });
}

export async function partnerVerifyResetOtp(
  payload: PartnerResetOtpPayload
): Promise<void> {
  const normalized = { ...payload, phone: normalizePhone(payload.phone) };
  await apiClient.post<ResponseWrapper<null>>(
    "/api/v1/auth/verify-reset-otp",
    normalized
  );
}

export async function partnerLogout(): Promise<void> {
  setPartnerToken(null);
}

export async function getCurrentPartner(): Promise<PartnerUser | null> {
  try {
    const res = await apiClient.get<ResponseWrapper<PartnerUser>>(
      "/api/v1/users/profile"
    );
    return res.data.data;
  } catch {
    return null;
  }
}

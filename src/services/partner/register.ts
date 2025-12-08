import { apiClient } from "@/lib/apiClient";
import type { ResponseWrapper } from "@/types/partner";
import type { AuthResponseData } from "@/services/partner/auth";

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

export interface PartnerRegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organizationName: string;
  courseSpecialization: string;
  pincode: string;
  password: string;
  avatar?: string;
}

export async function partnerRegister(
  input: PartnerRegisterInput
): Promise<AuthResponseData> {
  const payload = {
    name: `${input.firstName} ${input.lastName}`.trim(),
    phone: normalizePhone(input.phone),
    email: input.email,
    role: "partner" as const,
    password: input.password,
    avatar: input.avatar,
    // Additional fields are included so backend can optionally store them later
    organizationName: input.organizationName,
    courseSpecialization: input.courseSpecialization,
    pincode: input.pincode,
  };

  const res = await apiClient.post<ResponseWrapper<AuthResponseData>>(
    "/api/v1/auth/register",
    payload
  );

  return res.data.data;
}

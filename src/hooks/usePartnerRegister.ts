"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  partnerRegister,
  type PartnerRegisterInput,
} from "@/services/partner/register";

export function usePartnerRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: PartnerRegisterInput) => partnerRegister(input),
    onSuccess: (_data, variables) => {
      // After registration, go to OTP verification step using the phone entered
      const phone = variables.phone;
      router.replace(`/partner/register/otp?phone=${encodeURIComponent(phone)}`);
    },
  });
}

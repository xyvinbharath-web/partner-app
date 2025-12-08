"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  partnerSendRegisterOtp,
  partnerVerifyRegisterOtp,
  type PartnerRegisterOtpPayload,
} from "@/services/partner/auth";

export function usePartnerRegisterOtp(phone: string | null) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const sendMutation = useMutation({
    mutationFn: () => {
      if (!phone) throw new Error("Phone is required");
      return partnerSendRegisterOtp(phone);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (payload: PartnerRegisterOtpPayload) =>
      partnerVerifyRegisterOtp(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["partner", "me"] });
      if (data.user.status === "pending_approval" || data.user.role === "partner_request") {
        router.replace("/partner/onboarding");
      } else if (data.user.status === "rejected") {
        router.replace("/partner/rejected");
      } else {
        router.replace("/partner/dashboard");
      }
    },
  });

  return {
    sendOtp: sendMutation.mutateAsync,
    sendingOtp: sendMutation.isPending,
    verifyOtp: verifyMutation.mutateAsync,
    verifyingOtp: verifyMutation.isPending,
  };
}

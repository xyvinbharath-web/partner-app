"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentPartner, partnerLogout, partnerLogin } from "@/services/partner/auth";
import type { PartnerUser } from "@/types/partner";

export function usePartnerAuthSession() {
  return useQuery<PartnerUser | null>({
    queryKey: ["partner", "me"],
    queryFn: () => getCurrentPartner(),
    staleTime: 60_000,
  });
}

export function usePartnerAuthGuard() {
  const { data: user, isLoading } = usePartnerAuthSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const isAuthRoute =
      pathname?.startsWith("/partner/login") ||
      pathname?.startsWith("/partner/onboarding") ||
      pathname?.startsWith("/partner/register") ||
      pathname?.startsWith("/partner/forgot-password");

    if (!user && !isAuthRoute) {
      router.replace("/partner/login");
      return;
    }

    if (!user) return;

    // Enforce status-based access
    if (user.status === "pending_approval" || user.role === "partner_request") {
      if (!pathname?.startsWith("/partner/onboarding")) {
        router.replace("/partner/onboarding");
      }
      return;
    }

    if (user.status === "rejected") {
      if (!pathname?.startsWith("/partner/rejected")) {
        router.replace("/partner/rejected");
      }
      return;
    }

    // Approved / active partners: keep them out of auth routes
    if (isAuthRoute) {
      router.replace("/partner/dashboard");
    }
  }, [user, isLoading, pathname, router]);
}

export function usePartnerLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (payload: { phone: string; password: string }) =>
      partnerLogin(payload),
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

  const logoutMutation = useMutation({
    mutationFn: () => partnerLogout(),
    onSuccess: () => {
      queryClient.clear();
      router.replace("/partner/login");
    },
  });

  return {
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loggingIn: loginMutation.isPending,
    loggingOut: logoutMutation.isPending,
  };
}

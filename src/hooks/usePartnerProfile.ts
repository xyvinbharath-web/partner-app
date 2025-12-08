"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPartnerProfile,
  updatePartnerPassword,
  updatePartnerProfile,
  UpdatePartnerPasswordInput,
  UpdatePartnerProfileInput,
} from "@/services/partner/profile";
import type { PartnerUser } from "@/types/partner";

export function usePartnerProfile() {
  const { data, isLoading, isError, error, refetch } = useQuery<PartnerUser>({
    queryKey: ["partner-profile"],
    queryFn: () => getPartnerProfile(),
  });

  return { data, isLoading, isError, error, refetch };
}

export function useUpdatePartnerProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: UpdatePartnerProfileInput) => updatePartnerProfile(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["partner-profile"], updated);
      queryClient.invalidateQueries({ queryKey: ["partner", "me"] });
    },
  });

  return mutation;
}

export function useUpdatePartnerPassword() {
  const mutation = useMutation({
    mutationFn: (input: UpdatePartnerPasswordInput) => updatePartnerPassword(input),
  });

  return mutation;
}

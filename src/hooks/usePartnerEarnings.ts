"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPartnerEarnings, getPartnerPayoutHistory, PartnerPayoutsQuery } from "@/services/partner/earnings";
import type { PartnerEarnings, PaginatedResponse, PartnerTransaction } from "@/types/partner";

export function usePartnerEarnings() {
  const { data, isLoading, isError, error, refetch } = useQuery<PartnerEarnings>({
    queryKey: ["partner-earnings"],
    queryFn: () => getPartnerEarnings(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { data, isLoading, isError, error, refetch };
}

export function usePartnerPayoutHistory(initialQuery?: PartnerPayoutsQuery) {
  const [query, setQuery] = useState<PartnerPayoutsQuery>({
    page: 1,
    limit: 10,
    ...(initialQuery || {}),
  });

  const { data, isLoading, isError, error, refetch } = useQuery<
    PaginatedResponse<PartnerTransaction>
  >({
    queryKey: ["partner-payouts", query],
    queryFn: () => getPartnerPayoutHistory(query),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { data, isLoading, isError, error, refetch, query, setQuery };
}

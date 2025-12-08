"use client";

import { useQuery } from "@tanstack/react-query";
import { getPartnerEvent, PartnerEventWithAnalytics } from "@/services/partner/events";

export function usePartnerEvent(id: string | undefined) {
  const { data, isLoading, isError, error } = useQuery<PartnerEventWithAnalytics>({
    queryKey: ["partner-event", id],
    queryFn: () => getPartnerEvent(id as string),
    enabled: !!id,
  });

  return { data, isLoading, isError, error };
}

"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPartnerNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  markNotificationAsUnread,
  PartnerNotificationsQuery,
} from "@/services/partner/notifications";
import type { PaginatedResponse, PartnerNotification } from "@/types/partner";

export function usePartnerNotifications(initialQuery?: PartnerNotificationsQuery) {
  const [query, setQuery] = useState<PartnerNotificationsQuery>({
    page: 1,
    limit: 20,
    read: "all",
    ...(initialQuery || {}),
  });

  const { data, isLoading, isError, error, refetch } = useQuery<
    PaginatedResponse<PartnerNotification>
  >({
    queryKey: ["partner-notifications", query],
    queryFn: () => getPartnerNotifications(query),
  });

  return { data, isLoading, isError, error, refetch, query, setQuery };
}

export function usePartnerNotificationActions() {
  const queryClient = useQueryClient();

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-notifications"] });
    },
  });

  const markUnreadMutation = useMutation({
    mutationFn: (id: string) => markNotificationAsUnread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-notifications"] });
    },
  });

  return {
    markRead: markReadMutation.mutateAsync,
    markUnread: markUnreadMutation.mutateAsync,
    markAllRead: markAllReadMutation.mutateAsync,
    markingRead: markReadMutation.isPending,
    markingUnread: markUnreadMutation.isPending,
    markingAllRead: markAllReadMutation.isPending,
  };
}

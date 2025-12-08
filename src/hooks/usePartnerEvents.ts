"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveEventBooking,
  createPartnerEvent,
  deletePartnerEvent,
  getPartnerEvents,
  PartnerEventPayload,
  PartnerEventsQuery,
  rejectEventBooking,
  updatePartnerEvent,
} from "@/services/partner/events";
import type { PaginatedResponse, PartnerEvent } from "@/types/partner";

export function usePartnerEvents(initialQuery?: PartnerEventsQuery) {
  const [query, setQuery] = useState<PartnerEventsQuery>({
    page: 1,
    limit: 10,
    ...(initialQuery || {}),
  });

  const { data, isLoading, isError, error, refetch } = useQuery<
    PaginatedResponse<PartnerEvent>
  >({
    queryKey: ["partner-events", query],
    queryFn: () => getPartnerEvents(query),
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    query,
    setQuery,
  };
}

export function usePartnerEventMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: PartnerEventPayload) => createPartnerEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-events"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<PartnerEventPayload> }) =>
      updatePartnerEvent(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["partner-events"] });
      queryClient.setQueryData(["partner-event", updated._id], updated);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePartnerEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-events"] });
    },
  });

  const approveBookingMutation = useMutation({
    mutationFn: ({ eventId, bookingId }: { eventId: string; bookingId: string }) =>
      approveEventBooking(eventId, bookingId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["partner-event", variables.eventId] });
    },
  });

  const rejectBookingMutation = useMutation({
    mutationFn: ({ eventId, bookingId }: { eventId: string; bookingId: string }) =>
      rejectEventBooking(eventId, bookingId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["partner-event", variables.eventId] });
    },
  });

  return {
    createEvent: createMutation.mutateAsync,
    updateEvent: updateMutation.mutateAsync,
    deleteEvent: deleteMutation.mutateAsync,
    approveBooking: approveBookingMutation.mutateAsync,
    rejectBooking: rejectBookingMutation.mutateAsync,
    creating: createMutation.isPending,
    updating: updateMutation.isPending,
    deleting: deleteMutation.isPending,
    approvingBooking: approveBookingMutation.isPending,
    rejectingBooking: rejectBookingMutation.isPending,
  };
}

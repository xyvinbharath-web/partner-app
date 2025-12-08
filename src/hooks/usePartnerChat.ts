import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPartnerConversations,
  getPartnerConversationMessages,
  sendPartnerMessage,
} from "@/services/partner/chat";

export function usePartnerConversations() {
  return useQuery({
    queryKey: ["partner-chat-conversations"],
    queryFn: getPartnerConversations,
  });
}

export function usePartnerConversationMessages(conversationId?: string) {
  return useQuery({
    enabled: !!conversationId,
    queryKey: ["partner-chat-messages", conversationId],
    queryFn: () =>
      conversationId
        ? getPartnerConversationMessages(conversationId, { limit: 100 })
        : Promise.resolve({
            records: [],
            page: 1,
            limit: 100,
            totalPages: 1,
            totalRecords: 0,
          }),
  });
}

export function useSendPartnerMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ receiverId, text }: { receiverId: string; text: string }) =>
      sendPartnerMessage(receiverId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-chat-conversations"] });
      queryClient.invalidateQueries({ queryKey: ["partner-chat-messages"] });
    },
  });
}

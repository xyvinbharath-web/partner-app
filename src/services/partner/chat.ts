import { apiClient } from "@/lib/apiClient";
import type { ResponseWrapper } from "@/types/partner";

export interface ChatUserSummary {
  _id: string;
  name?: string;
  phone?: string;
  role?: string;
}

export interface ConversationRecord {
  _id: string;
  members: string[];
  lastMessage: string;
  updatedAt: string;
  otherUser: ChatUserSummary | null;
}

export interface ConversationsResponse {
  records: ConversationRecord[];
  page: number;
  limit: number;
  totalPages: number;
  totalRecords: number;
}

export interface MessageRecord {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  attachments: string[];
  seen: boolean;
  createdAt: string;
}

export interface ConversationMessagesResponse {
  records: MessageRecord[];
  page: number;
  limit: number;
  totalPages: number;
  totalRecords: number;
}

export async function getPartnerConversations() {
  const res = await apiClient.get<ResponseWrapper<ConversationsResponse>>(
    "/api/v1/chat/conversations"
  );
  return res.data.data;
}

export async function getPartnerConversationMessages(
  conversationId: string,
  params?: { page?: number; limit?: number }
) {
  const res = await apiClient.get<
    ResponseWrapper<ConversationMessagesResponse>
  >(`/api/v1/chat/conversations/${conversationId}/messages`, {
    params,
  });
  return res.data.data;
}

export async function sendPartnerMessage(
  receiverId: string,
  text: string
) {
  const res = await apiClient.post<ResponseWrapper<MessageRecord>>(
    "/api/v1/chat/message",
    { receiverId, text }
  );
  return res.data.data;
}

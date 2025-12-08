"use client";

import { useState } from "react";
import {
  usePartnerConversations,
  usePartnerConversationMessages,
  useSendPartnerMessage,
} from "@/hooks/usePartnerChat";
import { usePartnerAuthSession } from "@/hooks/usePartnerAuth";

export default function PartnerMessagesPage() {
  const { data: me } = usePartnerAuthSession();
  const currentUserId = me?._id;

  const { data: conversationsData, isLoading: convLoading } = usePartnerConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const selectedConversation = conversationsData?.records.find(
    (c) => c._id === selectedConversationId
  );
  const { data: messagesData, isLoading: msgsLoading } = usePartnerConversationMessages(
    selectedConversationId || undefined
  );
  const [draft, setDraft] = useState("");
  const sendMutation = useSendPartnerMessage();

  const handleSelect = (id: string) => {
    setSelectedConversationId(id);
  };

  const handleSend = async () => {
    const trimmed = draft.trim();
    if (!trimmed || !selectedConversation) return;
    const receiverId = selectedConversation.otherUser?._id;
    if (!receiverId) return;
    await sendMutation.mutateAsync({ receiverId, text: trimmed });
    setDraft("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-black">Messages</h2>
        <p className="text-sm text-slate-500">
          View and respond to messages from your learners.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
        {/* Conversations list */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Conversations</h3>
          {convLoading && <p className="text-sm text-slate-500">Loading conversations...</p>}
          {!convLoading && (!conversationsData || conversationsData.records.length === 0) && (
            <p className="text-sm text-slate-500">No conversations yet.</p>
          )}
          <div className="space-y-1">
            {conversationsData?.records.map((c) => {
              const active = c._id === selectedConversationId;
              const name = c.otherUser?.name || c.otherUser?.phone || "User";
              return (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => handleSelect(c._id)}
                  className={`flex w-full flex-col rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    active
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  <span className="font-medium">{name}</span>
                  {c.lastMessage && (
                    <span className="line-clamp-1 text-xs opacity-80">{c.lastMessage}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message thread */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          {selectedConversation ? (
            <div className="flex h-full flex-col">
              <div className="mb-3 border-b pb-2">
                <h3 className="text-sm font-semibold text-slate-800">
                  {selectedConversation.otherUser?.name ||
                    selectedConversation.otherUser?.phone ||
                    "User"}
                </h3>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto border-b pb-3 pr-1 text-sm">
                {msgsLoading && (
                  <p className="text-sm text-slate-500">Loading messages...</p>
                )}
                {!msgsLoading &&
                  messagesData?.records.map((m) => {
                    const mine = currentUserId && m.senderId === currentUserId;
                    return (
                      <div
                        key={m._id}
                        className={`flex ${
                          mine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs rounded-lg px-3 py-2 text-xs md:max-w-sm ${
                            mine
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          <p>{m.text}</p>
                        </div>
                      </div>
                    );
                  })}
                {!msgsLoading && messagesData && messagesData.records.length === 0 && (
                  <p className="text-sm text-slate-500">No messages in this conversation yet.</p>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <textarea
                  className="min-h-[40px] flex-1 resize-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                  rows={2}
                  placeholder="Type your message..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sendMutation.isPending || !draft.trim()}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-sm text-slate-500">
              <p>Select a conversation to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

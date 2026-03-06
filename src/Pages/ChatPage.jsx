import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useConversationMessages,
  useConversations,
  useSendMessageMutation,
} from "../hooks/useChat";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/getErrorMessage";

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [text, setText] = useState("");

  const conversationsQuery = useConversations({ enabled: Boolean(user?.id) });

  useEffect(() => {
    if (conversationsQuery.error) {
      toast.error(conversationsQuery.error);
    }
  }, [conversationsQuery.error]);

  const activeConversationId = useMemo(() => {
    if (conversationId) {
      return conversationId;
    }

    if (conversationsQuery.conversations.length > 0) {
      return conversationsQuery.conversations[0]._id;
    }

    return null;
  }, [conversationId, conversationsQuery.conversations]);

  useEffect(() => {
    if (!conversationId && activeConversationId) {
      navigate(`/chat/${activeConversationId}`, { replace: true });
    }
  }, [activeConversationId, conversationId, navigate]);

  const messagesQuery = useConversationMessages(
    activeConversationId,
    { page: 1, limit: 100 },
    { enabled: Boolean(activeConversationId) }
  );

  useEffect(() => {
    if (messagesQuery.error) {
      toast.error(messagesQuery.error);
    }
  }, [messagesQuery.error]);

  const sendMessageMutation = useSendMessageMutation();

  const getOtherParticipant = (conversation) => {
    const participants = conversation?.participants || [];
    return participants.find((participant) => participant._id !== user?.id) || participants[0] || null;
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!activeConversationId || !text.trim()) {
      return;
    }

    try {
      await sendMessageMutation.mutateAsync({
        conversationId: activeConversationId,
        text,
      });

      setText("");
      messagesQuery.refetch();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to send message."));
    }
  };

  if (conversationsQuery.loading) {
    return <div className="py-16 text-center text-[#6d8566]">Loading chats...</div>;
  }

  if (conversationsQuery.conversations.length === 0) {
    return <div className="py-16 text-center text-[#6d8566]">No conversations yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 h-[75vh]">
      <aside className="border border-[#e7eee7] rounded-xl overflow-y-auto">
        {conversationsQuery.conversations.map((conversation) => {
          const peer = getOtherParticipant(conversation);
          const isActive = conversation._id === activeConversationId;

          return (
            <button
              key={conversation._id}
              type="button"
              onClick={() => navigate(`/chat/${conversation._id}`)}
              className={`w-full text-left p-3 border-b border-[#f1f4f1] ${
                isActive ? "bg-[#eef7eb]" : "bg-white"
              }`}
            >
              <p className="font-semibold text-sm text-[#131712]">{peer?.name || "Unknown User"}</p>
              <p className="text-xs text-[#6d8566] line-clamp-1">{conversation?.product?.title || "General conversation"}</p>
            </button>
          );
        })}
      </aside>

      <section className="border border-[#e7eee7] rounded-xl flex flex-col">
        <div className="px-4 py-3 border-b border-[#f1f4f1]">
          <h2 className="font-semibold text-[#131712]">Conversation</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafcfa]">
          {messagesQuery.loading ? (
            <p className="text-[#6d8566]">Loading messages...</p>
          ) : messagesQuery.messages.length === 0 ? (
            <p className="text-[#6d8566]">No messages yet. Start the conversation.</p>
          ) : (
            messagesQuery.messages.map((message) => {
              const isMine = message?.sender?._id === user?.id;

              return (
                <div key={message._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                      isMine ? "bg-[#50d22c] text-[#131712]" : "bg-white border border-[#e7eee7] text-[#131712]"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-[10px] opacity-70 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={handleSendMessage} className="border-t border-[#f1f4f1] p-3 flex gap-2">
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type your message"
            className="flex-1 rounded-lg border border-[#dfe8df] px-3 py-2 outline-none"
          />
          <button
            type="submit"
            disabled={sendMessageMutation.isPending}
            className="rounded-lg px-4 py-2 bg-[#50d22c] text-[#131712] font-semibold disabled:opacity-60"
          >
            {sendMessageMutation.isPending ? "Sending..." : "Send"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ChatPage;

"use client";

import { usePartnerNotificationActions, usePartnerNotifications } from "@/hooks/usePartnerNotifications";

export default function PartnerNotificationsPage() {
  const { data, isLoading, query, setQuery } = usePartnerNotifications();
  const { markRead, markUnread, markAllRead, markingAllRead } =
    usePartnerNotificationActions();

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-lg font-semibold">Notifications</h1>
          <p className="text-sm text-slate-500">
            Stay updated with important alerts and activity.
          </p>
        </div>
        <button
          type="button"
          disabled={markingAllRead}
          onClick={() => markAllRead()}
          className="rounded-md border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {markingAllRead ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      <div className="flex gap-2 text-xs">
        {([
          ["all", "All"],
          ["unread", "Unread"],
          ["read", "Read"],
        ] as const).map(([value, label]) => {
          const active = query.read === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setQuery((prev) => ({ ...prev, read: value, page: 1 }))}
              className={`rounded-full border px-3 py-1 font-medium ${
                active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {isLoading && <div className="text-sm text-slate-500">Loading notifications...</div>}

      {!isLoading && data && data.records.length === 0 && (
        <div className="rounded-xl border bg-white p-6 text-center text-sm text-slate-500">
          No notifications yet.
        </div>
      )}

      {!isLoading && data && data.records.length > 0 && (
        <div className="space-y-2">
          {data.records.map((n) => {
            const isRead = Boolean(n.readAt);
            return (
              <div
                key={n._id}
                className={`flex items-start justify-between gap-3 rounded-xl border bg-white p-4 text-sm ${
                  !isRead ? "border-slate-900/10 bg-slate-50" : ""
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-slate-900">{n.title}</h2>
                    {!isRead && (
                      <span className="inline-flex rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{n.body}</p>
                  <div className="text-[11px] text-slate-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => (isRead ? markUnread(n._id) : markRead(n._id))}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  {isRead ? "Mark unread" : "Mark read"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePartnerEarnings, usePartnerPayoutHistory } from "@/hooks/usePartnerEarnings";
import { useState } from "react";

export default function PartnerEarningsPage() {
  const { data: earnings, isLoading } = usePartnerEarnings();
  const { data: payouts } = usePartnerPayoutHistory();

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawNote, setWithdrawNote] = useState("");

  const lastPayout = payouts?.records.find((t) => t.type === "withdrawal");

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only – no API call yet
    setWithdrawAmount("");
    setWithdrawNote("");
    alert("Withdraw request submitted (UI only).");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-10">
      <section className="rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-lg/40 backdrop-blur-sm md:p-6">
        <h1 className="text-xl font-semibold text-slate-900">Earnings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track your revenue, balance, and payout history.
        </p>
      </section>

      {isLoading && <div className="text-sm text-slate-500">Loading earnings...</div>}

      {earnings && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-sm md:p-6">
            <div className="text-xs text-slate-500">Total earnings</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">
              ₹{earnings.totalEarnings.toLocaleString()}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-sm md:p-6">
            <div className="text-xs text-slate-500">Available balance</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">
              ₹{earnings.availableBalance.toLocaleString()}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-sm md:p-6">
            <div className="text-xs text-slate-500">Last payout</div>
            <div className="mt-2 text-sm font-semibold text-slate-900">
              {lastPayout
                ? `₹${lastPayout.amount.toLocaleString()} on ${new Date(
                    lastPayout.createdAt
                  ).toLocaleDateString()}`
                : "No payouts yet"}
            </div>
          </div>
        </div>
      )}

      {earnings && (
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          <div className="space-y-4 rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-md md:p-6">
            <h2 className="text-sm font-semibold text-slate-900">Withdraw earnings</h2>
            <form onSubmit={handleWithdraw} className="space-y-3 text-sm">
              <div className="space-y-1">
                <label className="font-medium text-slate-700">Amount</label>
                <input
                  type="number"
                  min={1}
                  max={earnings.availableBalance}
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                />
              </div>
              <div className="space-y-1">
                <label className="font-medium text-slate-700">Note (optional)</label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                  value={withdrawNote}
                  onChange={(e) => setWithdrawNote(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 hover:shadow-md transition-all"
                >
                  Request withdrawal
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-md md:p-6">
            <h2 className="text-sm font-semibold text-slate-900">Monthly trend</h2>
            <div className="mt-2 h-40 text-xs text-slate-500">
              {/* Simple bar-like representation without external chart libs */}
              <div className="flex h-full items-end gap-1">
                {earnings.monthlyEarnings.map((m) => (
                  <div key={m.month} className="flex-1 text-center">
                    <div
                      className="mx-auto w-4 rounded-t-full bg-slate-900/90"
                      style={{ height: `${Math.min(100, m.amount / 10)}%` }}
                    />
                    <div className="mt-1 text-[10px] text-slate-500">{m.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-md md:p-6">
        <h2 className="text-sm font-semibold text-slate-900">Payout history</h2>
        {!payouts || payouts.records.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center gap-3 text-center text-sm text-slate-500">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              ₹
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">No payout history yet</p>
              <p className="mt-1 text-xs text-slate-500">
                Host events and sell courses to start earning payouts into your account.
              </p>
            </div>
            <Link
              href="/partner/events"
              className="mt-1 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 hover:shadow-md transition-all"
            >
              View events
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-4 hidden overflow-hidden rounded-2xl border border-slate-100 md:block">
              <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-2 text-left md:px-5">Date</th>
                    <th className="px-4 py-2 text-left md:px-5">Type</th>
                    <th className="px-4 py-2 text-right md:px-5">Amount</th>
                    <th className="px-4 py-2 text-left md:px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payouts.records.map((t) => (
                    <tr key={t._id} className="text-[13px] text-slate-700 hover:bg-slate-50/80">
                      <td className="px-4 py-3.5 text-[13px] text-slate-600 md:px-5">
                        {new Date(t.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] capitalize text-slate-600 md:px-5">
                        {t.type}
                      </td>
                      <td className="px-4 py-3.5 text-right text-[13px] text-slate-900 md:px-5">
                        ₹{t.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] capitalize text-slate-600 md:px-5">
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-3 md:hidden">
              {payouts.records.map((t) => (
                <div key={t._id} className="rounded-2xl border border-slate-100 bg-white/95 p-3 text-xs shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-slate-900 capitalize">{t.type}</div>
                    <div className="text-slate-600">
                      ₹{t.amount.toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    {new Date(t.createdAt).toLocaleString()} • {t.status}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

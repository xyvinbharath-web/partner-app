"use client";

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
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Earnings</h1>
        <p className="text-sm text-slate-500">
          Track your revenue, balance, and payout history.
        </p>
      </div>

      {isLoading && <div className="text-sm text-slate-500">Loading earnings...</div>}

      {earnings && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-4 md:p-6">
            <div className="text-xs text-slate-500">Total earnings</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">
              ₹{earnings.totalEarnings.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4 md:p-6">
            <div className="text-xs text-slate-500">Available balance</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">
              ₹{earnings.availableBalance.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4 md:p-6">
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
          <div className="space-y-4 rounded-xl border bg-white p-4 md:p-6">
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
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="font-medium text-slate-700">Note (optional)</label>
                <textarea
                  rows={2}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={withdrawNote}
                  onChange={(e) => setWithdrawNote(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Request withdrawal
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4 rounded-xl border bg-white p-4 md:p-6">
            <h2 className="text-sm font-semibold text-slate-900">Monthly trend</h2>
            <div className="mt-2 h-40 text-xs text-slate-500">
              {/* Simple bar-like representation without external chart libs */}
              <div className="flex h-full items-end gap-1">
                {earnings.monthlyEarnings.map((m) => (
                  <div key={m.month} className="flex-1 text-center">
                    <div
                      className="mx-auto w-4 rounded-t bg-slate-900"
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

      <div className="rounded-xl border bg-white p-4 md:p-6">
        <h2 className="text-sm font-semibold text-slate-900">Payout history</h2>
        {!payouts || payouts.records.length === 0 ? (
          <div className="mt-4 text-sm text-slate-500">No payout history yet.</div>
        ) : (
          <>
            <div className="mt-4 hidden overflow-hidden rounded-lg border md:block">
              <table className="min-w-full divide-y text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">Date</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">Type</th>
                    <th className="px-4 py-2 text-right font-medium text-slate-600">Amount</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payouts.records.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50">
                      <td className="px-4 py-2 text-sm text-slate-600">
                        {new Date(t.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-sm capitalize text-slate-600">
                        {t.type}
                      </td>
                      <td className="px-4 py-2 text-right text-sm text-slate-900">
                        ₹{t.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-sm capitalize text-slate-600">
                        {t.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-3 md:hidden">
              {payouts.records.map((t) => (
                <div key={t._id} className="rounded-lg border bg-slate-50 p-3 text-xs">
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

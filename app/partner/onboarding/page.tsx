"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { PartnerUser, ResponseWrapper } from "@/types/partner";
import { usePartnerAuthSession } from "@/hooks/usePartnerAuth";

interface OnboardingData {
  steps: string[];
}

export default function PartnerOnboardingPage() {
  const { data: me } = usePartnerAuthSession();

  const { data } = useQuery({
    queryKey: ["partner", "onboarding"],
    queryFn: async () => {
      const res = await apiClient.get<ResponseWrapper<OnboardingData>>(
        "/api/v1/partner/onboarding"
      );
      return res.data.data;
    },
  });

  const backendSteps = data?.steps ?? [];

  const defaultSteps = [
    "Registration complete",
    "Phone verified",
    "Awaiting admin approval",
  ];

  const steps = backendSteps.length > 0 ? backendSteps : defaultSteps;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
        <div className="space-y-1 pb-4">
          <h1 className="text-lg font-semibold text-slate-900">
            Your account is under review
          </h1>
          <p className="text-xs text-slate-500">
            Thanks for registering as a partner. Your account is currently being
            reviewed by the admin team. You&apos;ll be notified once a decision is
            made.
          </p>
        </div>

        {me && (
          <div className="mb-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
            <div className="font-medium text-slate-900">Your details</div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              <span>Name: {me.name}</span>
              {me.email && <span>Email: {me.email}</span>}
              {me.phone && <span>Phone: {me.phone}</span>}
            </div>
          </div>
        )}

        <ol className="space-y-2 text-sm text-slate-700">
          {steps.map((step, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[11px] font-medium text-white">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

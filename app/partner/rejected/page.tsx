"use client";

export default function PartnerRejectedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-lg font-semibold text-slate-900">
            Registration not approved
          </h1>
          <p className="text-xs text-slate-500">
            Your partner registration request was not approved by the admin team.
            If you believe this is a mistake, please contact support or try
            registering again with updated details.
          </p>
        </div>
      </div>
    </div>
  );
}

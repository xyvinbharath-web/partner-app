"use client";

import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

const PARTNER_TOKEN_KEY = "partner_token";

export function getPartnerToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PARTNER_TOKEN_KEY);
}

export function setPartnerToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (!token) {
    window.localStorage.removeItem(PARTNER_TOKEN_KEY);
    document.cookie =
      "partner_token=; Max-Age=0; path=/; secure; samesite=lax";
    return;
  }
  window.localStorage.setItem(PARTNER_TOKEN_KEY, token);
  document.cookie = `partner_token=${encodeURIComponent(
    token
  )}; Max-Age=86400; path=/; secure; samesite=lax`;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getPartnerToken();
  if (token && config.headers) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && typeof window !== "undefined") {
      setPartnerToken(null);

      const path = window.location.pathname || "";
      const isAuthRoute =
        path.startsWith("/partner/login") ||
        path.startsWith("/partner/register") ||
        path.startsWith("/partner/onboarding") ||
        path.startsWith("/partner/forgot-password");

      // Avoid infinite refresh loops when already on an auth route
      if (!isAuthRoute) {
        window.location.href = "/partner/login";
      }
    }
    return Promise.reject(error);
  }
);

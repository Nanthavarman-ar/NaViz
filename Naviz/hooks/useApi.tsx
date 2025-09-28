import { useState, useEffect } from "react";
import { supabase, projectId, publicAnonKey } from "../supabase/client";

export function useApi<T>(endpoint: string, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { session },
        } = await supabase.auth.getSession();
        const accessToken = session?.access_token || publicAnonKey;

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-cf230d31${endpoint}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("API fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => setLoading(true) };
}

export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session?.access_token || publicAnonKey;

  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-cf230d31${endpoint}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
}

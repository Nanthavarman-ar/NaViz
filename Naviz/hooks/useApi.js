import { useState, useEffect } from "react";
import { supabase, projectId, publicAnonKey } from "../supabase/client";
export function useApi(endpoint, dependencies = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Mock data for local development to avoid invalid Supabase calls
                if (endpoint === '/models') {
                    setData({ models: [
                        {
                            id: 1,
                            name: 'Modern Conference Table',
                            description: 'High-poly conference table with premium materials',
                            thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
                            tags: ['furniture', 'office', 'modern'],
                            uploadDate: '2025-01-15',
                            uploader: 'admin',
                            size: '12.4 MB',
                            format: 'glTF',
                            assignedClients: ['client1', 'client2'],
                            views: 45,
                            created_at: '2025-01-15',
                            status: 'active'
                        },
                        {
                            id: 2,
                            name: 'Executive Office Chair',
                            description: 'Ergonomic executive chair with leather finish',
                            thumbnail: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=200&fit=crop',
                            tags: ['furniture', 'chair', 'leather'],
                            uploadDate: '2025-01-14',
                            uploader: 'admin',
                            size: '8.7 MB',
                            format: 'glTF',
                            assignedClients: ['client1'],
                            views: 32,
                            created_at: '2025-01-14',
                            status: 'active'
                        }
                    ] });
                    setLoading(false);
                    return;
                }

                const { data: { session }, } = await supabase.auth.getSession();
                const accessToken = session?.access_token || publicAnonKey;
                const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-cf230d31${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
            }
            catch (err) {
                console.error("API fetch error:", err);
                setError(err instanceof Error ? err.message : "An error occurred");
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, dependencies);
    return { data, loading, error, refetch: () => setLoading(true) };
}
export async function apiCall(endpoint, options = {}) {
    const { data: { session }, } = await supabase.auth.getSession();
    const accessToken = session?.access_token || publicAnonKey;
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-cf230d31${endpoint}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }
    return response.json();
}

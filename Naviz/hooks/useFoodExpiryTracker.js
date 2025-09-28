import { useState, useEffect, useCallback } from 'react';
export const useFoodExpiryTracker = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Get auth token from localStorage or environment
    const getAuthToken = () => {
        return localStorage.getItem('authToken') || process.env.REACT_APP_AUTH_TOKEN || '';
    };
    // Helper function to make API requests
    const makeRequest = async (endpoint, options = {}) => {
        const token = getAuthToken();
        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
            ...options,
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Network error' }));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        return response.json();
    };
    // Fetch all food items
    const fetchFoodItems = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await makeRequest('/api/food-items');
            setFoodItems(data.foodItems || []);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch food items');
            console.error('Error fetching food items:', err);
        }
        finally {
            setLoading(false);
        }
    }, []);
    // Fetch statistics
    const fetchStatistics = useCallback(async () => {
        try {
            const data = await makeRequest('/api/food-items/statistics');
            setStatistics(data.statistics);
        }
        catch (err) {
            console.error('Error fetching statistics:', err);
        }
    }, []);
    // Refresh all data
    const refreshData = useCallback(async () => {
        await Promise.all([fetchFoodItems(), fetchStatistics()]);
    }, [fetchFoodItems, fetchStatistics]);
    // Add food item
    const addFoodItem = useCallback(async (item) => {
        try {
            setLoading(true);
            setError(null);
            await makeRequest('/api/food-items', {
                method: 'POST',
                body: JSON.stringify(item),
            });
            await refreshData();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add food item');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [refreshData]);
    // Update food item
    const updateFoodItem = useCallback(async (id, updates) => {
        try {
            setLoading(true);
            setError(null);
            await makeRequest(`/api/food-items/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
            });
            await refreshData();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update food item');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [refreshData]);
    // Delete food item
    const deleteFoodItem = useCallback(async (id) => {
        try {
            setLoading(true);
            setError(null);
            await makeRequest(`/api/food-items/${id}`, {
                method: 'DELETE',
            });
            await refreshData();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete food item');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [refreshData]);
    // Mark as consumed
    const markAsConsumed = useCallback(async (id) => {
        await updateFoodItem(id, { status: 'consumed' });
    }, [updateFoodItem]);
    // Mark as fresh
    const markAsFresh = useCallback(async (id) => {
        await updateFoodItem(id, { status: 'fresh' });
    }, [updateFoodItem]);
    // Get expiring soon items
    const getExpiringSoon = useCallback(async (days = 3) => {
        try {
            const data = await makeRequest(`/api/food-items/expiring-soon?days=${days}`);
            return data.expiringSoonItems || [];
        }
        catch (err) {
            console.error('Error fetching expiring soon items:', err);
            return [];
        }
    }, []);
    // Get expired items
    const getExpired = useCallback(async () => {
        try {
            const data = await makeRequest('/api/food-items/expired');
            return data.expiredItems || [];
        }
        catch (err) {
            console.error('Error fetching expired items:', err);
            return [];
        }
    }, []);
    // Get items by category
    const getByCategory = useCallback(async (category) => {
        try {
            const data = await makeRequest(`/api/food-items/category/${category}`);
            return data.categoryItems || [];
        }
        catch (err) {
            console.error('Error fetching category items:', err);
            return [];
        }
    }, []);
    // Get items by location
    const getByLocation = useCallback(async (location) => {
        try {
            const data = await makeRequest(`/api/food-items/location/${location}`);
            return data.locationItems || [];
        }
        catch (err) {
            console.error('Error fetching location items:', err);
            return [];
        }
    }, []);
    // Export data
    const exportData = useCallback(async () => {
        try {
            const data = await makeRequest('/api/food-items/export');
            return data.exportData;
        }
        catch (err) {
            console.error('Error exporting data:', err);
            throw err;
        }
    }, []);
    // Import data
    const importData = useCallback(async (items) => {
        try {
            setLoading(true);
            setError(null);
            await makeRequest('/api/food-items/import', {
                method: 'POST',
                body: JSON.stringify({ items }),
            });
            await refreshData();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import food items');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [refreshData]);
    // Load data on mount
    useEffect(() => {
        refreshData();
    }, [refreshData]);
    return {
        foodItems,
        statistics,
        loading,
        error,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        markAsConsumed,
        markAsFresh,
        getExpiringSoon,
        getExpired,
        getByCategory,
        getByLocation,
        exportData,
        importData,
        refreshData,
    };
};

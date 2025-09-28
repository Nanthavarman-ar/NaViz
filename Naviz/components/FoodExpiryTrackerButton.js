import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Package, AlertTriangle, Clock } from 'lucide-react';
import FoodExpiryTracker from './FoodExpiryTracker';
import { useFoodExpiryTracker } from '../hooks/useFoodExpiryTracker';
const FoodExpiryTrackerButton = ({ className = '', variant = 'outline', size = 'default' }) => {
    const [isTrackerOpen, setIsTrackerOpen] = useState(false);
    const { foodItems, statistics, getExpiringSoon, getExpired } = useFoodExpiryTracker();
    const [expiringSoonCount, setExpiringSoonCount] = useState(0);
    const [expiredCount, setExpiredCount] = useState(0);
    // Update counts when food items change
    React.useEffect(() => {
        const updateCounts = async () => {
            const expiring = await getExpiringSoon(3);
            const expired = await getExpired();
            setExpiringSoonCount(expiring.length);
            setExpiredCount(expired.length);
        };
        updateCounts();
    }, [foodItems, getExpiringSoon, getExpired]);
    const buttonSizeClasses = {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base'
    };
    const iconSizeClasses = {
        sm: 'w-3 h-3',
        default: 'w-4 h-4',
        lg: 'w-5 h-5'
    };
    const hasAlerts = expiringSoonCount > 0 || expiredCount > 0;
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "relative", children: [_jsxs(Button, { variant: hasAlerts ? 'destructive' : variant, size: size, onClick: () => setIsTrackerOpen(true), className: `relative ${className} ${buttonSizeClasses[size]}`, children: [_jsx(Package, { className: `${iconSizeClasses[size]} mr-2` }), "Food Tracker", (expiringSoonCount > 0 || expiredCount > 0) && (_jsxs("div", { className: "absolute -top-2 -right-2 flex gap-1", children: [expiringSoonCount > 0 && (_jsx(Badge, { variant: "destructive", className: "h-5 w-5 p-0 text-xs flex items-center justify-center rounded-full", children: expiringSoonCount })), expiredCount > 0 && (_jsx(Badge, { variant: "destructive", className: "h-5 w-5 p-0 text-xs flex items-center justify-center rounded-full bg-red-600", children: expiredCount }))] }))] }), _jsx("div", { className: "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Package, { className: "w-3 h-3" }), _jsxs("span", { children: ["Total: ", statistics?.total || 0] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3 text-yellow-400" }), _jsxs("span", { children: ["Expiring: ", expiringSoonCount] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(AlertTriangle, { className: "w-3 h-3 text-red-400" }), _jsxs("span", { children: ["Expired: ", expiredCount] })] })] }) })] }), _jsx(FoodExpiryTracker, { isActive: isTrackerOpen, onClose: () => setIsTrackerOpen(false) })] }));
};
export default FoodExpiryTrackerButton;

import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Plus, AlertTriangle, CheckCircle, XCircle, Edit, Trash2, Search, Package, Refrigerator, Utensils, ShoppingCart, Camera, Users, BarChart3, Scan, Wifi, WifiOff } from 'lucide-react';
import { format, differenceInDays, isBefore, addDays } from 'date-fns';
import ARVRFoundation from './ARVRFoundation';
import BarcodeScanner from './BarcodeScanner';
import CollaborationPanel from './CollaborationPanel';
import AnalyticsDashboard from './AnalyticsDashboard';
const FoodExpiryTracker = ({ isActive, onClose }) => {
    const [foodItems, setFoodItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expiringSoonDays, setExpiringSoonDays] = useState(3);
    // Advanced features state
    const [showARVR, setShowARVR] = useState(false);
    const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
    const [showCollaboration, setShowCollaboration] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [arvrMode, setArvrMode] = useState('ar');
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category: 'other',
        quantity: 1,
        unit: 'pieces',
        purchaseDate: format(new Date(), 'yyyy-MM-dd'),
        expiryDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
        storageLocation: 'pantry',
        notes: ''
    });
    // Online/offline status tracking
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    // Load food items from localStorage on component mount
    useEffect(() => {
        if (isActive) {
            loadFoodItems();
        }
    }, [isActive]);
    // Filter items based on search and filters
    useEffect(() => {
        let filtered = foodItems;
        if (searchTerm) {
            filtered = filtered.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.notes?.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(item => item.category === categoryFilter);
        }
        if (statusFilter !== 'all') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }
        setFilteredItems(filtered);
    }, [foodItems, searchTerm, categoryFilter, statusFilter]);
    const loadFoodItems = () => {
        const saved = localStorage.getItem('foodExpiryItems');
        if (saved) {
            const items = JSON.parse(saved);
            setFoodItems(items);
        }
    };
    const saveFoodItems = (items) => {
        localStorage.setItem('foodExpiryItems', JSON.stringify(items));
        setFoodItems(items);
    };
    const getItemStatus = (item) => {
        const today = new Date();
        const expiryDate = new Date(item.expiryDate);
        if (item.status === 'consumed')
            return 'consumed';
        if (isBefore(expiryDate, today))
            return 'expired';
        const daysUntilExpiry = differenceInDays(expiryDate, today);
        if (daysUntilExpiry <= expiringSoonDays)
            return 'expiring_soon';
        return 'fresh';
    };
    const updateItemStatuses = useCallback(() => {
        setFoodItems(prevItems => prevItems.map(item => ({
            ...item,
            status: getItemStatus(item)
        })));
    }, [expiringSoonDays]);
    // Update statuses periodically
    useEffect(() => {
        updateItemStatuses();
        const interval = setInterval(updateItemStatuses, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [updateItemStatuses]);
    const handleSubmit = (e) => {
        e.preventDefault();
        const now = new Date().toISOString();
        const newItem = {
            id: editingItem?.id || `food_${Date.now()}`,
            ...formData,
            status: getItemStatus({
                ...formData,
                id: '',
                status: 'fresh',
                createdAt: now,
                updatedAt: now
            }),
            createdAt: editingItem?.createdAt || now,
            updatedAt: now
        };
        if (editingItem) {
            setFoodItems(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
        }
        else {
            setFoodItems(prev => [...prev, newItem]);
        }
        // Reset form
        setFormData({
            name: '',
            category: 'other',
            quantity: 1,
            unit: 'pieces',
            purchaseDate: format(new Date(), 'yyyy-MM-dd'),
            expiryDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
            storageLocation: 'pantry',
            notes: ''
        });
        setIsAddingItem(false);
        setEditingItem(null);
    };
    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            purchaseDate: item.purchaseDate,
            expiryDate: item.expiryDate,
            storageLocation: item.storageLocation,
            notes: item.notes || ''
        });
        setIsAddingItem(true);
    };
    const handleDelete = (id) => {
        setFoodItems(prev => prev.filter(item => item.id !== id));
    };
    const handleStatusChange = (id, status) => {
        setFoodItems(prev => prev.map(item => item.id === id
            ? { ...item, status, updatedAt: new Date().toISOString() }
            : item));
    };
    const handleBarcodeDetected = (barcode, barcodeFormat) => {
        // Auto-fill form with common barcode data
        const commonItems = {
            'DEMO123456': {
                name: 'Demo Milk 2L',
                category: 'dairy',
                quantity: 1,
                unit: 'pieces',
                expiryDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
                storageLocation: 'fridge'
            },
            'DEMO234567': {
                name: 'Demo Bread',
                category: 'grains',
                quantity: 1,
                unit: 'pieces',
                expiryDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
                storageLocation: 'pantry'
            }
        };
        const itemData = commonItems[barcode] || {
            name: `Scanned Item (${barcode})`,
            category: 'other',
            quantity: 1,
            unit: 'pieces',
            expiryDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
            storageLocation: 'pantry'
        };
        setFormData(prev => ({ ...prev, ...itemData }));
        setIsAddingItem(true);
        setShowBarcodeScanner(false);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'fresh': return 'bg-green-500';
            case 'expiring_soon': return 'bg-yellow-500';
            case 'expired': return 'bg-red-500';
            case 'consumed': return 'bg-gray-500';
            default: return 'bg-gray-400';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'fresh': return _jsx(CheckCircle, { className: "w-4 h-4" });
            case 'expiring_soon': return _jsx(AlertTriangle, { className: "w-4 h-4" });
            case 'expired': return _jsx(XCircle, { className: "w-4 h-4" });
            case 'consumed': return _jsx(CheckCircle, { className: "w-4 h-4" });
            default: return _jsx(Package, { className: "w-4 h-4" });
        }
    };
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'dairy': return _jsx(Refrigerator, { className: "w-4 h-4" });
            case 'meat': return _jsx(Utensils, { className: "w-4 h-4" });
            case 'vegetables':
            case 'fruits': return _jsx(Package, { className: "w-4 h-4" });
            case 'beverages': return _jsx(ShoppingCart, { className: "w-4 h-4" });
            default: return _jsx(Package, { className: "w-4 h-4" });
        }
    };
    const getStorageIcon = (location) => {
        switch (location) {
            case 'fridge': return _jsx(Refrigerator, { className: "w-4 h-4" });
            case 'freezer': return _jsx(Refrigerator, { className: "w-4 h-4" });
            case 'pantry': return _jsx(Package, { className: "w-4 h-4" });
            case 'counter': return _jsx(Package, { className: "w-4 h-4" });
            default: return _jsx(Package, { className: "w-4 h-4" });
        }
    };
    const getExpiringSoonCount = () => {
        return foodItems.filter(item => getItemStatus(item) === 'expiring_soon').length;
    };
    const getExpiredCount = () => {
        return foodItems.filter(item => getItemStatus(item) === 'expired').length;
    };
    if (!isActive)
        return null;
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: [_jsxs(Card, { className: "w-full max-w-6xl max-h-[90vh] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700", children: [_jsxs(CardHeader, { className: "pb-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2 text-xl", children: [_jsx(Package, { className: "w-6 h-6 text-blue-500" }), "Food Expiry Tracker", _jsxs(Badge, { variant: isOnline ? 'default' : 'destructive', className: "ml-2", children: [isOnline ? _jsx(Wifi, { className: "w-3 h-3 mr-1" }) : _jsx(WifiOff, { className: "w-3 h-3 mr-1" }), isOnline ? 'Online' : 'Offline'] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { size: "sm", variant: "outline", onClick: () => setShowBarcodeScanner(true), className: "flex items-center gap-2", children: [_jsx(Scan, { className: "w-4 h-4" }), "Scan"] }), _jsxs(Button, { size: "sm", variant: "outline", onClick: () => setShowARVR(true), className: "flex items-center gap-2", children: [_jsx(Camera, { className: "w-4 h-4" }), "AR/VR"] }), _jsxs(Button, { size: "sm", variant: "outline", onClick: () => setShowCollaboration(true), className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-4 h-4" }), "Collaborate"] }), _jsxs(Button, { size: "sm", variant: "outline", onClick: () => setShowAnalytics(true), className: "flex items-center gap-2", children: [_jsx(BarChart3, { className: "w-4 h-4" }), "Analytics"] }), _jsxs(Button, { size: "sm", variant: "outline", onClick: () => setIsAddingItem(true), className: "flex items-center gap-2", children: [_jsx(Plus, { className: "w-4 h-4" }), "Add Item"] }), _jsx(Button, { size: "sm", variant: "ghost", onClick: onClose, children: _jsx(XCircle, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "grid grid-cols-4 gap-4 mt-4", children: [_jsxs("div", { className: "text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: foodItems.filter(item => getItemStatus(item) === 'fresh').length }), _jsx("div", { className: "text-sm text-green-600 dark:text-green-400", children: "Fresh" })] }), _jsxs("div", { className: "text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-yellow-600 dark:text-yellow-400", children: getExpiringSoonCount() }), _jsx("div", { className: "text-sm text-yellow-600 dark:text-yellow-400", children: "Expiring Soon" })] }), _jsxs("div", { className: "text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-red-600 dark:text-red-400", children: getExpiredCount() }), _jsx("div", { className: "text-sm text-red-600 dark:text-red-400", children: "Expired" })] }), _jsxs("div", { className: "text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600 dark:text-blue-400", children: foodItems.length }), _jsx("div", { className: "text-sm text-blue-600 dark:text-blue-400", children: "Total Items" })] })] })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-wrap gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg", children: [_jsxs("div", { className: "flex-1 min-w-[200px]", children: [_jsx(Label, { htmlFor: "search", children: "Search" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" }), _jsx(Input, { id: "search", placeholder: "Search food items...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10" })] })] }), _jsxs("div", { className: "min-w-[150px]", children: [_jsx(Label, { htmlFor: "category", children: "Category" }), _jsxs(Select, { value: categoryFilter, onValueChange: setCategoryFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Categories" }), _jsx(SelectItem, { value: "dairy", children: "Dairy" }), _jsx(SelectItem, { value: "meat", children: "Meat" }), _jsx(SelectItem, { value: "vegetables", children: "Vegetables" }), _jsx(SelectItem, { value: "fruits", children: "Fruits" }), _jsx(SelectItem, { value: "grains", children: "Grains" }), _jsx(SelectItem, { value: "beverages", children: "Beverages" }), _jsx(SelectItem, { value: "other", children: "Other" })] })] })] }), _jsxs("div", { className: "min-w-[150px]", children: [_jsx(Label, { htmlFor: "status", children: "Status" }), _jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Status" }), _jsx(SelectItem, { value: "fresh", children: "Fresh" }), _jsx(SelectItem, { value: "expiring_soon", children: "Expiring Soon" }), _jsx(SelectItem, { value: "expired", children: "Expired" }), _jsx(SelectItem, { value: "consumed", children: "Consumed" })] })] })] }), _jsxs("div", { className: "min-w-[150px]", children: [_jsx(Label, { htmlFor: "expiringDays", children: "Expiring Soon (days)" }), _jsx(Input, { id: "expiringDays", type: "number", min: "1", max: "30", value: expiringSoonDays, onChange: (e) => setExpiringSoonDays(parseInt(e.target.value) || 3) })] })] }), _jsxs(ScrollArea, { className: "h-[400px]", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredItems.map((item) => (_jsx(Card, { className: "relative", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [getCategoryIcon(item.category), _jsx("h3", { className: "font-semibold text-sm", children: item.name })] }), _jsxs(Badge, { variant: "secondary", className: `${getStatusColor(item.status)} text-white flex items-center gap-1`, children: [getStatusIcon(item.status), item.status.replace('_', ' ')] })] }), _jsxs("div", { className: "space-y-2 text-xs text-slate-600 dark:text-slate-400", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Quantity:" }), _jsxs("span", { children: [item.quantity, " ", item.unit] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Category:" }), _jsx("span", { className: "capitalize", children: item.category })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Storage:" }), _jsxs("span", { className: "flex items-center gap-1 capitalize", children: [getStorageIcon(item.storageLocation), item.storageLocation] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Expires:" }), _jsx("span", { className: getItemStatus(item) === 'expired' ? 'text-red-500 font-medium' : '', children: format(new Date(item.expiryDate), 'MMM dd, yyyy') })] }), item.notes && (_jsx("div", { className: "mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs", children: item.notes }))] }), _jsxs("div", { className: "flex items-center justify-between mt-4", children: [_jsxs("div", { className: "flex gap-1", children: [_jsx(Button, { size: "sm", variant: "ghost", onClick: () => handleEdit(item), className: "h-8 w-8 p-0", children: _jsx(Edit, { className: "w-3 h-3" }) }), _jsx(Button, { size: "sm", variant: "ghost", onClick: () => handleDelete(item.id), className: "h-8 w-8 p-0 text-red-500 hover:text-red-700", children: _jsx(Trash2, { className: "w-3 h-3" }) })] }), _jsxs("div", { className: "flex gap-1", children: [item.status !== 'consumed' && (_jsx(Button, { size: "sm", variant: "outline", onClick: () => handleStatusChange(item.id, 'consumed'), className: "h-8 px-2 text-xs", children: "Mark Consumed" })), item.status === 'consumed' && (_jsx(Button, { size: "sm", variant: "outline", onClick: () => handleStatusChange(item.id, 'fresh'), className: "h-8 px-2 text-xs", children: "Mark Fresh" }))] })] })] }) }, item.id))) }), filteredItems.length === 0 && (_jsxs("div", { className: "text-center py-8 text-slate-500 dark:text-slate-400", children: [_jsx(Package, { className: "w-12 h-12 mx-auto mb-4 opacity-50" }), _jsx("p", { children: "No food items found matching your criteria." }), _jsx(Button, { variant: "outline", onClick: () => setIsAddingItem(true), className: "mt-4", children: "Add Your First Item" })] }))] })] })] }), isAddingItem && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs(Card, { className: "w-full max-w-md bg-white dark:bg-slate-900", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Plus, { className: "w-5 h-5" }), editingItem ? 'Edit Food Item' : 'Add Food Item'] }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "name", children: "Food Name *" }), _jsx(Input, { id: "name", value: formData.name, onChange: (e) => setFormData(prev => ({ ...prev, name: e.target.value })), required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "category", children: "Category" }), _jsxs(Select, { value: formData.category, onValueChange: (value) => setFormData(prev => ({ ...prev, category: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "dairy", children: "Dairy" }), _jsx(SelectItem, { value: "meat", children: "Meat" }), _jsx(SelectItem, { value: "vegetables", children: "Vegetables" }), _jsx(SelectItem, { value: "fruits", children: "Fruits" }), _jsx(SelectItem, { value: "grains", children: "Grains" }), _jsx(SelectItem, { value: "beverages", children: "Beverages" }), _jsx(SelectItem, { value: "other", children: "Other" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "quantity", children: "Quantity" }), _jsx(Input, { id: "quantity", type: "number", min: "0", step: "0.1", value: formData.quantity, onChange: (e) => setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 })) })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "unit", children: "Unit" }), _jsxs(Select, { value: formData.unit, onValueChange: (value) => setFormData(prev => ({ ...prev, unit: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "pieces", children: "Pieces" }), _jsx(SelectItem, { value: "kg", children: "Kilograms" }), _jsx(SelectItem, { value: "grams", children: "Grams" }), _jsx(SelectItem, { value: "liters", children: "Liters" }), _jsx(SelectItem, { value: "ml", children: "Milliliters" })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "purchaseDate", children: "Purchase Date" }), _jsx(Input, { id: "purchaseDate", type: "date", value: formData.purchaseDate, onChange: (e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value })) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "expiryDate", children: "Expiry Date" }), _jsx(Input, { id: "expiryDate", type: "date", value: formData.expiryDate, onChange: (e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value })), required: true })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "storageLocation", children: "Storage Location" }), _jsxs(Select, { value: formData.storageLocation, onValueChange: (value) => setFormData(prev => ({ ...prev, storageLocation: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "fridge", children: "Refrigerator" }), _jsx(SelectItem, { value: "freezer", children: "Freezer" }), _jsx(SelectItem, { value: "pantry", children: "Pantry" }), _jsx(SelectItem, { value: "counter", children: "Counter" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "notes", children: "Notes (optional)" }), _jsx(Textarea, { id: "notes", value: formData.notes, onChange: (e) => setFormData(prev => ({ ...prev, notes: e.target.value })), placeholder: "Any additional notes...", rows: 3 })] }), _jsxs("div", { className: "flex gap-2 pt-4", children: [_jsx(Button, { type: "submit", className: "flex-1", children: editingItem ? 'Update Item' : 'Add Item' }), _jsx(Button, { type: "button", variant: "outline", onClick: () => {
                                                            setIsAddingItem(false);
                                                            setEditingItem(null);
                                                            setFormData({
                                                                name: '',
                                                                category: 'other',
                                                                quantity: 1,
                                                                unit: 'pieces',
                                                                purchaseDate: format(new Date(), 'yyyy-MM-dd'),
                                                                expiryDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
                                                                storageLocation: 'pantry',
                                                                notes: ''
                                                            });
                                                        }, children: "Cancel" })] })] }) })] }) }))] }), _jsx(ARVRFoundation, { isActive: showARVR, onClose: () => setShowARVR(false), mode: arvrMode }), _jsx(BarcodeScanner, { isActive: showBarcodeScanner, onClose: () => setShowBarcodeScanner(false), onBarcodeDetected: handleBarcodeDetected }), _jsx(CollaborationPanel, { isActive: showCollaboration, onClose: () => setShowCollaboration(false), currentUser: {
                    id: 'user_1',
                    name: 'Current User',
                    role: 'admin',
                    status: 'online',
                    lastSeen: new Date()
                } }), _jsx(AnalyticsDashboard, { isActive: showAnalytics, onClose: () => setShowAnalytics(false) })] }));
};
export default FoodExpiryTracker;

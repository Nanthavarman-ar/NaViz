import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Settings, User, Shield, Bell, Database, Save, Trash2, Key, Mail, Globe } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';

// Mock settings data
const mockSettings = {
    general: {
        appName: 'NAVIZ Studio',
        version: '2.1.0',
        theme: 'dark',
        language: 'en',
        timezone: 'UTC'
    },
    security: {
        twoFactorEnabled: true,
        sessionTimeout: 30,
        ipWhitelisting: false,
        apiRateLimit: 1000,
        passwordPolicy: 'strong'
    },
    notifications: {
        emailAlerts: true,
        pushNotifications: false,
        smsEnabled: false,
        auditLogEmails: ['admin@naviz.com']
    },
    integrations: {
        supabaseUrl: 'https://project.supabase.co',
        supabaseKey: 'anon_key_hidden',
        stripeEnabled: false,
        stripeKey: '',
        googleAnalytics: true,
        gaTrackingId: 'GA-XXXXXXX'
    },
    users: [
        { id: 1, name: 'Admin User', email: 'admin@naviz.com', role: 'admin', lastLogin: '2025-01-15', status: 'active' },
        { id: 2, name: 'Support User', email: 'support@naviz.com', role: 'support', lastLogin: '2025-01-14', status: 'active' },
        { id: 3, name: 'Backup Admin', email: 'backup@naviz.com', role: 'admin', lastLogin: '2025-01-10', status: 'inactive' }
    ]
};

export function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState(mockSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleSaveSettings = async (tab) => {
        setIsSaving(true);
        try {
            // Simulate API save
            console.log(`Saving ${tab} settings:`, settings[tab]);
            // In real implementation, call API to update settings
            setTimeout(() => {
                setIsSaving(false);
            }, 1000);
        } catch (error) {
            console.error('Save failed:', error);
            setIsSaving(false);
        }
    };

    const handleDeleteUser = (userId) => {
        setDeleteTarget(userId);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            setSettings(prev => ({
                ...prev,
                users: prev.users.filter(user => user.id !== deleteTarget)
            }));
            setShowDeleteDialog(false);
            setDeleteTarget(null);
        }
    };

    const updateSetting = (tab, key, value) => {
        setSettings(prev => ({
            ...prev,
            [tab]: {
                ...prev[tab],
                [key]: value
            }
        }));
    };

    const renderGeneralTab = () => (
        <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Application Settings
                    </CardTitle>
                    <CardDescription>Configure basic application properties</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-white">App Name</Label>
                            <Input
                                value={settings.general.appName}
                                onChange={(e) => updateSetting('general', 'appName', e.target.value)}
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
                        <div>
                            <Label className="text-white">Language</Label>
                            <Select value={settings.general.language} onValueChange={(value) => updateSetting('general', 'language', value)}>
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="es">Spanish</SelectItem>
                                    <SelectItem value="fr">French</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-white">Timezone</Label>
                            <Select value={settings.general.timezone} onValueChange={(value) => updateSetting('general', 'timezone', value)}>
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UTC">UTC</SelectItem>
                                    <SelectItem value="EST">Eastern Standard Time</SelectItem>
                                    <SelectItem value="PST">Pacific Standard Time</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="theme"
                                checked={settings.general.theme === 'dark'}
                                onCheckedChange={(checked) => updateSetting('general', 'theme', checked ? 'dark' : 'light')}
                            />
                            <Label htmlFor="theme" className="text-white">Dark Mode</Label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => handleSaveSettings('general')} disabled={isSaving}>
                            Discard Changes
                        </Button>
                        <Button onClick={() => handleSaveSettings('general')} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderSecurityTab = () => (
        <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Security Settings
                    </CardTitle>
                    <CardDescription>Configure authentication and access controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="twoFactor"
                                checked={settings.security.twoFactorEnabled}
                                onCheckedChange={(checked) => updateSetting('security', 'twoFactorEnabled', checked)}
                            />
                            <Label htmlFor="twoFactor" className="text-white">Two-Factor Authentication</Label>
                        </div>
                        <div>
                            <Label className="text-white">Session Timeout (minutes)</Label>
                            <Input
                                type="number"
                                value={settings.security.sessionTimeout}
                                onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                                className="bg-slate-700 border-slate-600 text-white w-32"
                                min="5"
                                max="120"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="ipWhitelist"
                                checked={settings.security.ipWhitelisting}
                                onCheckedChange={(checked) => updateSetting('security', 'ipWhitelisting', checked)}
                            />
                            <Label htmlFor="ipWhitelist" className="text-white">IP Whitelisting</Label>
                        </div>
                        <div>
                            <Label className="text-white">API Rate Limit (requests/hour)</Label>
                            <Input
                                type="number"
                                value={settings.security.apiRateLimit}
                                onChange={(e) => updateSetting('security', 'apiRateLimit', parseInt(e.target.value))}
                                className="bg-slate-700 border-slate-600 text-white w-32"
                                min="100"
                                max="10000"
                            />
                        </div>
                        <div>
                            <Label className="text-white">Password Policy</Label>
                            <Select value={settings.security.passwordPolicy} onValueChange={(value) => updateSetting('security', 'passwordPolicy', value)}>
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weak">Weak (6+ chars)</SelectItem>
                                    <SelectItem value="medium">Medium (8+ chars, 1 number)</SelectItem>
                                    <SelectItem value="strong">Strong (12+ chars, upper/lower/number/symbol)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => handleSaveSettings('security')} disabled={isSaving}>
                            Discard Changes
                        </Button>
                        <Button onClick={() => handleSaveSettings('security')} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notification Settings
                    </CardTitle>
                    <CardDescription>Configure alert and notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="emailAlerts"
                                checked={settings.notifications.emailAlerts}
                                onCheckedChange={(checked) => updateSetting('notifications', 'emailAlerts', checked)}
                            />
                            <Label htmlFor="emailAlerts" className="text-white">Email Alerts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="pushNotifications"
                                checked={settings.notifications.pushNotifications}
                                onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
                            />
                            <Label htmlFor="pushNotifications" className="text-white">Push Notifications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="smsEnabled"
                                checked={settings.notifications.smsEnabled}
                                onCheckedChange={(checked) => updateSetting('notifications', 'smsEnabled', checked)}
                            />
                            <Label htmlFor="smsEnabled" className="text-white">SMS Notifications</Label>
                        </div>
                        <div>
                            <Label className="text-white">Audit Log Email Recipients</Label>
                            <Textarea
                                value={settings.notifications.auditLogEmails.join(', ')}
                                onChange={(e) => updateSetting('notifications', 'auditLogEmails', e.target.value.split(',').map(email => email.trim()))}
                                className="bg-slate-700 border-slate-600 text-white"
                                placeholder="admin@naviz.com, support@naviz.com"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => handleSaveSettings('notifications')} disabled={isSaving}>
                            Discard Changes
                        </Button>
                        <Button onClick={() => handleSaveSettings('notifications')} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderIntegrationsTab = () => (
        <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Integrations
                    </CardTitle>
                    <CardDescription>Configure third-party service connections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                        <div>
                            <Label className="text-white">Supabase URL</Label>
                            <Input
                                value={settings.integrations.supabaseUrl}
                                onChange={(e) => updateSetting('integrations', 'supabaseUrl', e.target.value)}
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="stripeEnabled"
                                checked={settings.integrations.stripeEnabled}
                                onCheckedChange={(checked) => updateSetting('integrations', 'stripeEnabled', checked)}
                            />
                            <Label htmlFor="stripeEnabled" className="text-white">Stripe Payments</Label>
                        </div>
                        {settings.integrations.stripeEnabled && (
                            <div>
                                <Label className="text-white">Stripe Publishable Key</Label>
                                <Input
                                    value={settings.integrations.stripeKey}
                                    onChange={(e) => updateSetting('integrations', 'stripeKey', e.target.value)}
                                    className="bg-slate-700 border-slate-600 text-white"
                                    placeholder="pk_test_..."
                                />
                            </div>
                        )}
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="googleAnalytics"
                                checked={settings.integrations.googleAnalytics}
                                onCheckedChange={(checked) => updateSetting('integrations', 'googleAnalytics', checked)}
                            />
                            <Label htmlFor="googleAnalytics" className="text-white">Google Analytics</Label>
                        </div>
                        {settings.integrations.googleAnalytics && (
                            <div>
                                <Label className="text-white">GA Tracking ID</Label>
                                <Input
                                    value={settings.integrations.gaTrackingId}
                                    onChange={(e) => updateSetting('integrations', 'gaTrackingId', e.target.value)}
                                    className="bg-slate-700 border-slate-600 text-white"
                                    placeholder="GA-XXXXXXX"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => handleSaveSettings('integrations')} disabled={isSaving}>
                            Discard Changes
                        </Button>
                        <Button onClick={() => handleSaveSettings('integrations')} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderUsersTab = () => (
        <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <User className="w-5 h-5" />
                        User Management
                    </CardTitle>
                    <CardDescription>Manage admin and support users</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-white font-semibold">Admin Users</h3>
                            <Button variant="outline" className="border-green-400 text-green-400">
                                Add New User
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {settings.users.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{user.name}</p>
                                            <p className="text-gray-400 text-sm">{user.email}</p>
                                        </div>
                                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'}>
                                            {user.role.toUpperCase()}
                                        </Badge>
                                        <Badge variant="outline" className={user.status === 'active' ? 'border-green-400 text-green-400' : 'border-red-400 text-red-400'}>
                                            {user.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span>{new Date(user.lastLogin).toLocaleDateString()}</span>
                                        <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                                            <Key className="w-4 h-4 mr-1" />
                                            Reset Password
                                        </Button>
                                        <Button size="sm" variant="outline" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white" onClick={() => handleDeleteUser(user.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Settings</h2>
                    <p className="text-gray-400">Configure NAVIZ Studio system preferences</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-700">
                    <TabsTrigger value="general" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                        General
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                        Integrations
                    </TabsTrigger>
                    <TabsTrigger value="users" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                        Users
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="mt-6">{renderGeneralTab()}</TabsContent>
                <TabsContent value="security" className="mt-6">{renderSecurityTab()}</TabsContent>
                <TabsContent value="notifications" className="mt-6">{renderNotificationsTab()}</TabsContent>
                <TabsContent value="integrations" className="mt-6">{renderIntegrationsTab()}</TabsContent>
                <TabsContent value="users" className="mt-6">{renderUsersTab()}</TabsContent>
            </Tabs>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the user account and remove their data from the system.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

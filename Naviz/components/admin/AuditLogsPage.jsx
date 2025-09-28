import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Alert, AlertDescription } from '../ui/alert';
import { Search, Download, Filter, Calendar, User, FileText, Database, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';

// Mock audit logs data
const mockAuditLogs = [
    {
        id: 1,
        timestamp: '2025-01-15T10:30:00Z',
        user: 'admin',
        action: 'USER_CREATED',
        resource: 'Client: John Smith',
        details: 'New client account created with email john.smith@company.com',
        ip: '192.168.1.100',
        status: 'success'
    },
    {
        id: 2,
        timestamp: '2025-01-15T09:45:00Z',
        user: 'client1',
        action: 'MODEL_VIEWED',
        resource: 'Model: Modern Conference Table',
        details: 'Viewed model in 3D workspace',
        ip: '192.168.1.101',
        status: 'success'
    },
    {
        id: 3,
        timestamp: '2025-01-15T08:20:00Z',
        user: 'admin',
        action: 'MODEL_UPLOADED',
        resource: 'Model: Executive Office Chair',
        details: 'Uploaded new GLTF model (8.7 MB)',
        ip: '192.168.1.100',
        status: 'success'
    },
    {
        id: 4,
        timestamp: '2025-01-14T16:15:00Z',
        user: 'client2',
        action: 'MODEL_DOWNLOADED',
        resource: 'Model: Reception Desk Setup',
        details: 'Downloaded model for local use',
        ip: '192.168.1.102',
        status: 'success'
    },
    {
        id: 5,
        timestamp: '2025-01-14T14:50:00Z',
        user: 'admin',
        action: 'CLIENT_DEACTIVATED',
        resource: 'Client: Michael Brown',
        details: 'Client account deactivated due to inactivity',
        ip: '192.168.1.100',
        status: 'success'
    },
    {
        id: 6,
        timestamp: '2025-01-14T12:30:00Z',
        user: 'client3',
        action: 'LOGIN_FAILED',
        resource: 'Authentication',
        details: 'Invalid credentials attempt',
        ip: '192.168.1.103',
        status: 'failure'
    }
];

export function AuditLogsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [dateRange, setDateRange] = useState({ start: null, end: null });
    const [selectedLog, setSelectedLog] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    const filteredLogs = mockAuditLogs.filter(log => {
        const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
        const matchesDate = !dateRange.start || new Date(log.timestamp) >= dateRange.start;
        const matchesEndDate = !dateRange.end || new Date(log.timestamp) <= dateRange.end;
        return matchesSearch && matchesStatus && matchesDate && matchesEndDate;
    });

    const handleExportLogs = async () => {
        setIsExporting(true);
        try {
            // Simulate export to CSV
            const csvContent = "data:text/csv;charset=utf-8," +
                "Timestamp,User,Action,Resource,Details,IP,Status\n" +
                filteredLogs.map(log => 
                    `"${log.timestamp}","${log.user}","${log.action}","${log.resource}","${log.details}","${log.ip}","${log.status}"`
                ).join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const statusColors = {
        success: 'bg-green-100 text-green-800',
        failure: 'bg-red-100 text-red-800'
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Audit Logs</h2>
                    <p className="text-gray-400">System activity and user actions log</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={handleExportLogs} disabled={isExporting} variant="outline">
                        {isExporting ? 'Exporting...' : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Export CSV
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search logs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white rounded-lg px-3 py-2"
                        >
                            <option value="all">All Status</option>
                            <option value="success">Success</option>
                            <option value="failure">Failure</option>
                        </select>
                        <div className="flex gap-2">
                            <div className="flex flex-col">
                                <Label className="text-white mb-1">Start Date</Label>
                                <Input
                                    type="date"
                                    value={dateRange.start ? new Date(dateRange.start).toISOString().split('T')[0] : ''}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value ? new Date(e.target.value) : null }))}
                                    className="bg-slate-700 border-slate-600 text-white"
                                />
                            </div>
                            <div className="flex flex-col">
                                <Label className="text-white mb-1">End Date</Label>
                                <Input
                                    type="date"
                                    value={dateRange.end ? new Date(dateRange.end).toISOString().split('T')[0] : ''}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value ? new Date(e.target.value) : null }))}
                                    className="bg-slate-700 border-slate-600 text-white"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Total Logs</p>
                                <p className="text-2xl font-bold text-white">{filteredLogs.length}</p>
                            </div>
                            <FileText className="w-8 h-8 text-cyan-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Success Actions</p>
                                <p className="text-2xl font-bold text-white">
                                    {filteredLogs.filter(log => log.status === 'success').length}
                                </p>
                            </div>
                            <Database className="w-8 h-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Failure Actions</p>
                                <p className="text-2xl font-bold text-white">
                                    {filteredLogs.filter(log => log.status === 'failure').length}
                                </p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-red-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Today</p>
                                <p className="text-2xl font-bold text-white">
                                    {filteredLogs.filter(log => new Date(log.timestamp).toDateString() === new Date().toDateString()).length}
                                </p>
                            </div>
                            <Calendar className="w-8 h-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Logs Table */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                    <CardDescription className="text-gray-400">
                        System audit trail showing all user and admin actions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredLogs.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg mb-2">No logs found</p>
                            <p className="text-gray-500">Try adjusting your filters or search terms</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-left">Timestamp</TableHead>
                                    <TableHead className="text-left">User</TableHead>
                                    <TableHead className="text-left">Action</TableHead>
                                    <TableHead className="text-left">Resource</TableHead>
                                    <TableHead className="text-left">Status</TableHead>
                                    <TableHead className="text-right">IP Address</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.slice(0, 50).map((log) => ( // Limit to 50 for performance
                                    <TableRow key={log.id} className="hover:bg-slate-700/50 border-slate-600">
                                        <TableCell className="text-gray-300">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-white font-medium">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-400" />
                                                {log.user}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-300">
                                            <Badge variant="outline" className={`border-${log.status === 'success' ? 'green' : 'red'}-400 text-${log.status === 'success' ? 'green' : 'red'}-400`}>
                                                {log.action}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-300">{log.resource}</TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[log.status] || 'bg-gray-100 text-gray-800'}>
                                                {log.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-gray-400">{log.ip}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {filteredLogs.length > 50 && (
                        <div className="text-center py-4 text-gray-400">
                            Showing first 50 of {filteredLogs.length} logs. Use export for full data.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Details Dialog */}
            <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
                <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Log Details</DialogTitle>
                        <DialogDescription>Full details of the audit log entry</DialogDescription>
                    </DialogHeader>
                    {selectedLog && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-gray-400">Timestamp</Label>
                                    <p className="text-white font-mono">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-400">User</Label>
                                    <p className="text-white">{selectedLog.user}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-400">Action</Label>
                                    <p className="text-white font-semibold">{selectedLog.action}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-400">Status</Label>
                                    <Badge className={statusColors[selectedLog.status]}>
                                        {selectedLog.status.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <Label className="text-gray-400">Resource</Label>
                                <p className="text-white">{selectedLog.resource}</p>
                            </div>
                            <div>
                                <Label className="text-gray-400">Details</Label>
                                <p className="text-gray-300 whitespace-pre-wrap">{selectedLog.details}</p>
                            </div>
                            <div>
                                <Label className="text-gray-400">IP Address</Label>
                                <p className="text-white">{selectedLog.ip}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

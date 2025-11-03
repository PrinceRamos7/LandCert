import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { NotificationModal } from '@/Components/ui/notification-modal';
import BulkActions from '@/Components/ui/bulk-actions';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    CalendarDays,
    MapPin,
    User,
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    Search,
    Eye,
    Mail,
    Building2,
    DollarSign,
    MoreVertical,
    Edit,
    ThumbsUp,
    ThumbsDown,
    Trash2,
    Download
} from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useForm, router } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';

export function AdminRequestList({ requests, flash = {} }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [bulkLoading, setBulkLoading] = useState(false);
    const { toast } = useToast();
    const { post, processing } = useForm();

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            toast({
                title: "Success!",
                description: flash.success,
                duration: 5000,
            });
        }
        if (flash?.error) {
            toast({
                variant: "destructive",
                title: "Some operations failed",
                description: flash.error,
                duration: 7000,
            });
        }
    }, [flash, toast]);
    const { data: editData, setData: setEditData, post: postEdit, processing: editProcessing } = useForm({
        evaluation: '',
        description: '',
        amount: '',
        date_certified: '',
        issued_by: '',
    });

    const requestsData = requests?.data || requests || [];

    const handleAction = (request, action) => {
        if (!request.report_id) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No report found for this request.",
            });
            return;
        }

        router.post(route('admin.update-evaluation', request.report_id), {
            evaluation: action,
            issued_by: 'Admin',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Success!",
                    description: `Request ${action} successfully!`,
                });
            },
            onError: (errors) => {
                console.error('Update error:', errors);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to update request status.",
                });
            }
        });
    };

    const handleExport = () => {
        const url = route('admin.export.requests', { status: filterStatus });
        window.location.href = url;
        toast({
            title: "Export Started",
            description: "Your CSV file will download shortly.",
        });
    };

    const handleEdit = (request) => {
        setSelectedRequest(request);
        setEditData({
            evaluation: request.evaluation || request.status || 'pending',
            description: request.project_nature || '',
            amount: request.project_cost || '',
            date_certified: '',
            issued_by: '',
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();

        if (!selectedRequest.report_id) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No report found for this request.",
            });
            return;
        }

        router.post(route('admin.update-evaluation', selectedRequest.report_id), editData, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Success!",
                    description: "Request updated successfully!",
                });
                setIsEditModalOpen(false);
            },
            onError: (errors) => {
                console.error('Update error:', errors);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to update request.",
                });
            }
        });
    };

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState(null);
    const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
    const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
    const [requestToAction, setRequestToAction] = useState(null);
    const [rejectionFeedback, setRejectionFeedback] = useState('');
    const [notificationModal, setNotificationModal] = useState({
        isOpen: false,
        type: "success",
        title: "",
        message: "",
        buttonText: "Continue"
    });

    const handleDeleteClick = (request) => {
        setRequestToDelete(request);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!requestToDelete) return;

        router.delete(route('admin.delete-request', requestToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setRequestToDelete(null);
                setNotificationModal({
                    isOpen: true,
                    type: "success",
                    title: "Request Deleted!",
                    message: `Request #${requestToDelete.id} has been permanently deleted from the system.`,
                    buttonText: "Continue"
                });
            },
            onError: (errors) => {
                console.error('Delete error:', errors);
                setIsDeleteDialogOpen(false);
                setNotificationModal({
                    isOpen: true,
                    type: "error",
                    title: "Delete Failed!",
                    message: "Failed to delete the request. Please try again or contact support if the problem persists.",
                    buttonText: "Try Again"
                });
            }
        });
    };

    const handleAcceptClick = (request) => {
        if (!request.report_id) {
            setNotificationModal({
                isOpen: true,
                type: "error",
                title: "Error",
                message: "No report found for this request. Please contact support if this issue persists.",
                buttonText: "OK"
            });
            return;
        }
        setRequestToAction(request);
        setIsAcceptDialogOpen(true);
    };

    const confirmAccept = () => {
        if (!requestToAction) return;

        router.post(route('admin.update-evaluation', requestToAction.report_id), {
            evaluation: 'approved',
            issued_by: 'Admin',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsAcceptDialogOpen(false);
                setRequestToAction(null);
                setNotificationModal({
                    isOpen: true,
                    type: "success",
                    title: "Request Approved!",
                    message: `Request #${requestToAction.id} from ${requestToAction.applicant_name} has been approved successfully. The applicant will be notified via email.`,
                    buttonText: "Continue"
                });
            },
            onError: (errors) => {
                setIsAcceptDialogOpen(false);
                setNotificationModal({
                    isOpen: true,
                    type: "error",
                    title: "Approval Failed!",
                    message: "Failed to approve the request. Please try again or contact support if the problem persists.",
                    buttonText: "Try Again"
                });
            }
        });
    };

    const handleDeclineClick = (request) => {
        if (!request.report_id) {
            setNotificationModal({
                isOpen: true,
                type: "error",
                title: "Error",
                message: "No report found for this request. Please contact support if this issue persists.",
                buttonText: "OK"
            });
            return;
        }
        setRequestToAction(request);
        setRejectionFeedback(''); // Reset feedback
        setIsDeclineDialogOpen(true);
    };

    const confirmDecline = () => {
        if (!requestToAction) return;

        // Validate that feedback is provided
        if (!rejectionFeedback.trim()) {
            setNotificationModal({
                isOpen: true,
                type: "warning",
                title: "Feedback Required",
                message: "Please provide feedback explaining why this request is being rejected. This feedback will be sent to the applicant to help them understand what needs to be corrected.",
                buttonText: "OK"
            });
            return;
        }

        router.post(route('admin.update-evaluation', requestToAction.report_id), {
            evaluation: 'rejected',
            description: rejectionFeedback.trim(),
            issued_by: 'Admin',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeclineDialogOpen(false);
                setRequestToAction(null);
                setRejectionFeedback('');
                setNotificationModal({
                    isOpen: true,
                    type: "success",
                    title: "Request Declined!",
                    message: `Request #${requestToAction.id} from ${requestToAction.applicant_name} has been declined. The applicant has been notified via email with your feedback.`,
                    buttonText: "Continue"
                });
            },
            onError: (errors) => {
                setIsDeclineDialogOpen(false);
                setNotificationModal({
                    isOpen: true,
                    type: "error",
                    title: "Decline Failed!",
                    message: "Failed to decline the request. Please try again or contact support if the problem persists.",
                    buttonText: "Try Again"
                });
            }
        });
    };

    // Bulk Actions Handlers
    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedItems(filteredRequests.map(request => request.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (requestId, checked) => {
        if (checked) {
            setSelectedItems(prev => [...prev, requestId]);
        } else {
            setSelectedItems(prev => prev.filter(id => id !== requestId));
        }
    };

    const handleClearSelection = () => {
        setSelectedItems([]);
    };

    const handleBulkApprove = async (selectedIds) => {
        setBulkLoading(true);
        
        try {
            await new Promise((resolve, reject) => {
                router.post(route('admin.bulk.approve'), {
                    request_ids: selectedIds
                }, {
                    preserveScroll: true,
                    onSuccess: () => resolve(),
                    onError: (errors) => reject(new Error('Failed to approve requests'))
                });
            });
        } catch (error) {
            throw error;
        } finally {
            setBulkLoading(false);
        }
    };

    const handleBulkReject = async (selectedIds, reason) => {
        setBulkLoading(true);
        
        try {
            await new Promise((resolve, reject) => {
                router.post(route('admin.bulk.reject'), {
                    request_ids: selectedIds,
                    reason: reason
                }, {
                    preserveScroll: true,
                    onSuccess: () => resolve(),
                    onError: (errors) => reject(new Error('Failed to reject requests'))
                });
            });
        } catch (error) {
            throw error;
        } finally {
            setBulkLoading(false);
        }
    };

    const handleBulkDelete = async (selectedIds) => {
        setBulkLoading(true);
        
        try {
            await new Promise((resolve, reject) => {
                router.delete(route('admin.bulk.delete'), {
                    data: { request_ids: selectedIds },
                    preserveScroll: true,
                    onSuccess: () => resolve(),
                    onError: (errors) => reject(new Error('Failed to delete requests'))
                });
            });
        } catch (error) {
            throw error;
        } finally {
            setBulkLoading(false);
        }
    };

    const handleBulkExport = (selectedIds) => {
        const selectedRequests = filteredRequests.filter(req => selectedIds.includes(req.id));
        const csvContent = generateCSV(selectedRequests);
        downloadCSV(csvContent, `selected-requests-${new Date().toISOString().split('T')[0]}.csv`);
    };

    const generateCSV = (requests) => {
        const headers = ['ID', 'Applicant Name', 'User Email', 'Project Type', 'Status', 'Created Date'];
        const rows = requests.map(req => [
            req.id,
            req.applicant_name || '',
            req.user_email || '',
            req.project_type || '',
            req.status || 'pending',
            formatDate(req.created_at)
        ]);
        
        return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    };

    const downloadCSV = (content, filename) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-300';
            case 'rejected':
                return 'bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-300';
            default:
                return 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <CheckCircle2 className="h-4 w-4" />;
            case 'rejected':
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatLocation = (request) => {
        const parts = [
            request?.project_location_street,
            request?.project_location_barangay,
            request?.project_location_city || request?.project_location_municipality,
            request?.project_location_province
        ].filter(Boolean);
        return parts.join(', ') || 'Location not specified';
    };

    const filteredRequests = useMemo(() => {
        let filtered = requestsData;

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(r => r.status === filterStatus);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(r =>
                r.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.project_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.id?.toString().includes(searchTerm)
            );
        }

        return filtered;
    }, [requestsData, filterStatus, searchTerm]);

    const stats = useMemo(() => {
        return {
            total: requestsData.length,
            pending: requestsData.filter(r => r.status === 'pending').length,
            approved: requestsData.filter(r => r.status === 'approved').length,
            rejected: requestsData.filter(r => r.status === 'rejected').length,
        };
    }, [requestsData]);

    const handlePageChange = (url) => {
        if (url) {
            router.get(url, {}, { preserveState: true, preserveScroll: true });
        }
    };

    const renderPaginationLinks = () => {
        if (!requests?.links || requests.links.length <= 3) return null;

        return (
            <Pagination className="mt-6">
                <PaginationContent>
                    {requests.links.map((link, index) => {
                        if (index === 0) {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationPrevious
                                        onClick={() => handlePageChange(link.url)}
                                        className={!link.url ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    />
                                </PaginationItem>
                            );
                        }

                        if (index === requests.links.length - 1) {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationNext
                                        onClick={() => handlePageChange(link.url)}
                                        className={!link.url ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    />
                                </PaginationItem>
                            );
                        }

                        if (link.label === '...') {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }

                        return (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    onClick={() => handlePageChange(link.url)}
                                    isActive={link.active}
                                    className="cursor-pointer"
                                >
                                    {link.label}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}
                </PaginationContent>
            </Pagination>
        );
    };

    return (
        <div className="space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6"
            style={{
                backgroundImage: `
                 radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                 radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
                 radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
               `
            }}>
            {/* Statistics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom duration-700">
                <Card className="group hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 cursor-pointer border-0 bg-gradient-to-br from-white via-purple-50 to-purple-100 backdrop-blur-sm transform hover:scale-105 hover:-translate-y-2 rounded-2xl overflow-hidden relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500" onClick={() => setFilterStatus('all')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                        <CardTitle className="text-sm font-semibold text-purple-900 group-hover:text-purple-800 transition-colors">Total Requests</CardTitle>
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-4xl font-bold text-purple-700 group-hover:text-purple-800 transition-colors mb-2">{stats.total}</div>
                        <p className="text-sm text-purple-600 group-hover:text-purple-700 transition-colors">All submissions</p>
                    </CardContent>
                </Card>

                <Card className="group hover:shadow-2xl hover:shadow-amber-500/25 transition-all duration-500 cursor-pointer border-0 bg-gradient-to-br from-white via-amber-50 to-amber-100 backdrop-blur-sm transform hover:scale-105 hover:-translate-y-2 rounded-2xl overflow-hidden relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-amber-500/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500" onClick={() => setFilterStatus('pending')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                        <CardTitle className="text-sm font-semibold text-amber-900 group-hover:text-amber-800 transition-colors">Pending</CardTitle>
                        <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg group-hover:shadow-amber-500/50 transition-all duration-300 group-hover:scale-110">
                            <Clock className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-4xl font-bold text-amber-700 group-hover:text-amber-800 transition-colors mb-2">{stats.pending}</div>
                        <p className="text-sm text-amber-600 group-hover:text-amber-700 transition-colors">Awaiting review</p>
                    </CardContent>
                </Card>

                <Card className="group hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 cursor-pointer border-0 bg-gradient-to-br from-white via-emerald-50 to-emerald-100 backdrop-blur-sm transform hover:scale-105 hover:-translate-y-2 rounded-2xl overflow-hidden relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-emerald-500/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500" onClick={() => setFilterStatus('approved')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                        <CardTitle className="text-sm font-semibold text-emerald-900 group-hover:text-emerald-800 transition-colors">Approved</CardTitle>
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300 group-hover:scale-110">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-4xl font-bold text-emerald-700 group-hover:text-emerald-800 transition-colors mb-2">{stats.approved}</div>
                        <p className="text-sm text-emerald-600 group-hover:text-emerald-700 transition-colors">Successfully processed</p>
                    </CardContent>
                </Card>

                <Card className="group hover:shadow-2xl hover:shadow-rose-500/25 transition-all duration-500 cursor-pointer border-0 bg-gradient-to-br from-white via-rose-50 to-rose-100 backdrop-blur-sm transform hover:scale-105 hover:-translate-y-2 rounded-2xl overflow-hidden relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-rose-500/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500" onClick={() => setFilterStatus('rejected')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                        <CardTitle className="text-sm font-semibold text-rose-900 group-hover:text-rose-800 transition-colors">Rejected</CardTitle>
                        <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg group-hover:shadow-rose-500/50 transition-all duration-300 group-hover:scale-110">
                            <XCircle className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-4xl font-bold text-rose-700 group-hover:text-rose-800 transition-colors mb-2">{stats.rejected}</div>
                        <p className="text-sm text-rose-600 group-hover:text-rose-700 transition-colors">Needs attention</p>
                    </CardContent>
                </Card>
            </div>

            {/* Requests Table */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3 text-xl font-bold">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <FileText className="h-6 w-6" />
                            </div>
                            All Requests ({filteredRequests.length})
                        </CardTitle>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={handleExport}
                                className="gap-2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                            >
                                <Download className="h-4 w-4" />
                                Export CSV
                            </Button>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                                <Input
                                    placeholder="Search requests..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                                />
                            </div>
                            {filterStatus !== 'all' && (
                                <Button
                                    variant="outline"
                                    onClick={() => setFilterStatus('all')}
                                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                                >
                                    Clear Filter
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {/* Bulk Actions */}
                    <BulkActions
                        selectedItems={selectedItems}
                        onClearSelection={handleClearSelection}
                        onBulkApprove={handleBulkApprove}
                        onBulkReject={handleBulkReject}
                        onBulkDelete={handleBulkDelete}
                        onBulkExport={handleBulkExport}
                        isLoading={bulkLoading}
                        className="mb-6"
                    />

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left p-3 font-semibold w-12">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.length === filteredRequests.length && filteredRequests.length > 0}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="text-left p-3 font-semibold">ID</th>
                                    <th className="text-left p-3 font-semibold">Applicant</th>
                                    <th className="text-left p-3 font-semibold">User</th>
                                    <th className="text-left p-3 font-semibold">Project Type</th>
                                    <th className="text-left p-3 font-semibold">Location</th>
                                    <th className="text-left p-3 font-semibold">Date</th>
                                    <th className="text-left p-3 font-semibold">Status</th>
                                    <th className="text-left p-3 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map((request, index) => (
                                    <tr
                                        key={request.id}
                                        className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 ${
                                            selectedItems.includes(request.id) ? 'bg-blue-50' : ''
                                        }`}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <td className="p-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(request.id)}
                                                onChange={(e) => handleSelectItem(request.id, e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="p-3 font-mono text-sm">#{request.id}</td>
                                        <td className="p-3">
                                            <div>
                                                <p className="font-medium">{request.applicant_name}</p>
                                                {request.corporation_name && (
                                                    <p className="text-xs text-gray-500">{request.corporation_name}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div>
                                                <p className="text-sm font-medium">{request.user_name}</p>
                                                <p className="text-xs text-gray-500">{request.user_email}</p>
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm">{request.project_type || 'N/A'}</td>
                                        <td className="p-3 text-sm max-w-xs truncate">{formatLocation(request)}</td>
                                        <td className="p-3 text-sm">{formatDate(request.created_at)}</td>
                                        <td className="p-3">
                                            <Badge className={getStatusColor(request.status)}>
                                                <span className="flex items-center gap-1">
                                                    {getStatusIcon(request.status)}
                                                    {(request.status || 'pending').charAt(0).toUpperCase() + (request.status || 'pending').slice(1)}
                                                </span>
                                            </Badge>
                                        </td>
                                        <td className="p-3">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedRequest(request);
                                                            setIsModalOpen(true);
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEdit(request)}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleAcceptClick(request)}
                                                        disabled={request.status === 'approved'}
                                                        className="text-emerald-600"
                                                    >
                                                        <ThumbsUp className="h-4 w-4 mr-2" />
                                                        Accept
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeclineClick(request)}
                                                        disabled={request.status === 'rejected'}
                                                        className="text-rose-600"
                                                    >
                                                        <ThumbsDown className="h-4 w-4 mr-2" />
                                                        Decline
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteClick(request)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {renderPaginationLinks()}
                </CardContent>
            </Card>

            {/* Request Details Modal - Enhanced Landscape Layout */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-[95vw] w-full max-h-[85vh] overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 border-0 shadow-2xl rounded-3xl">
                    {/* Modal Header with Gradient Background */}
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6 -m-6 mb-6 rounded-t-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <FileText className="h-6 w-6" />
                                </div>
                                Request Details #{selectedRequest?.id}
                            </DialogTitle>
                            <DialogDescription className="text-blue-100 text-lg">
                                Submitted on {formatDate(selectedRequest?.created_at)} • Status: {(selectedRequest?.status || 'pending').charAt(0).toUpperCase() + (selectedRequest?.status || 'pending').slice(1)}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="overflow-y-auto max-h-[calc(85vh-200px)] pr-2">
                        {selectedRequest && (
                            <div className="space-y-8">
                                {/* Top Row - User & Applicant Info */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* User Information Card */}
                                    <div className="group hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 bg-gradient-to-br from-white via-blue-50 to-blue-100 backdrop-blur-sm transform hover:scale-[1.02] rounded-2xl overflow-hidden border border-blue-200/50">
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                <User className="h-5 w-5" />
                                                User Information
                                            </h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-white/70 rounded-xl border border-blue-200">
                                                <div>
                                                    <p className="text-sm text-gray-600 font-medium">Full Name</p>
                                                    <p className="text-lg font-bold text-blue-900">{selectedRequest.user_name}</p>
                                                </div>
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <User className="h-5 w-5 text-blue-600" />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-white/70 rounded-xl border border-blue-200">
                                                <div>
                                                    <p className="text-sm text-gray-600 font-medium">Email Address</p>
                                                    <p className="text-lg font-bold text-blue-900 flex items-center gap-2">
                                                        <Mail className="h-4 w-4" />
                                                        {selectedRequest.user_email}
                                                    </p>
                                                </div>
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Mail className="h-5 w-5 text-blue-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Applicant Information Card */}
                                    <div className="group hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 bg-gradient-to-br from-white via-emerald-50 to-emerald-100 backdrop-blur-sm transform hover:scale-[1.02] rounded-2xl overflow-hidden border border-emerald-200/50">
                                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4">
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                <Building2 className="h-5 w-5" />
                                                Applicant Information
                                            </h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="p-3 bg-white/70 rounded-xl border border-emerald-200">
                                                    <p className="text-sm text-gray-600 font-medium">Applicant Name</p>
                                                    <p className="text-lg font-bold text-emerald-900">{selectedRequest.applicant_name}</p>
                                                </div>
                                                <div className="p-3 bg-white/70 rounded-xl border border-emerald-200">
                                                    <p className="text-sm text-gray-600 font-medium">Corporation</p>
                                                    <p className="text-lg font-bold text-emerald-900">{selectedRequest.corporation_name || 'Individual Applicant'}</p>
                                                </div>
                                                <div className="p-3 bg-white/70 rounded-xl border border-emerald-200">
                                                    <p className="text-sm text-gray-600 font-medium">Address</p>
                                                    <p className="text-base font-semibold text-emerald-900">{selectedRequest.applicant_address}</p>
                                                </div>
                                                {selectedRequest.corporation_address && (
                                                    <div className="p-3 bg-white/70 rounded-xl border border-emerald-200">
                                                        <p className="text-sm text-gray-600 font-medium">Corporation Address</p>
                                                        <p className="text-base font-semibold text-emerald-900">{selectedRequest.corporation_address}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status & Timeline Row */}
                                <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                                                {getStatusIcon(selectedRequest.status)}
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium">Current Status</p>
                                                <Badge className={`${getStatusColor(selectedRequest.status)} text-lg px-4 py-2 mt-1`}>
                                                    <span className="flex items-center gap-2">
                                                        {getStatusIcon(selectedRequest.status)}
                                                        {(selectedRequest.status || 'pending').charAt(0).toUpperCase() + (selectedRequest.status || 'pending').slice(1)}
                                                    </span>
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 font-medium">Submission Date</p>
                                            <p className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                <CalendarDays className="h-5 w-5" />
                                                {formatDate(selectedRequest.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Details - Full Width */}
                                <div className="group hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 bg-gradient-to-br from-white via-purple-50 to-purple-100 backdrop-blur-sm transform hover:scale-[1.01] rounded-2xl overflow-hidden border border-purple-200/50">
                                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4">
                                        <h3 className="font-bold text-xl flex items-center gap-3">
                                            <Building2 className="h-6 w-6" />
                                            Project Details & Specifications
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            <div className="p-4 bg-white/70 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                                                <p className="text-sm text-gray-600 font-medium">Project Type</p>
                                                <p className="text-lg font-bold text-purple-900">{selectedRequest.project_type || 'N/A'}</p>
                                            </div>
                                            <div className="p-4 bg-white/70 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                                                <p className="text-sm text-gray-600 font-medium">Project Nature</p>
                                                <p className="text-lg font-bold text-purple-900">{selectedRequest.project_nature || 'N/A'}</p>
                                            </div>
                                            <div className="p-4 bg-white/70 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 md:col-span-2">
                                                <p className="text-sm text-gray-600 font-medium flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    Project Location
                                                </p>
                                                <p className="text-base font-bold text-purple-900">{formatLocation(selectedRequest)}</p>
                                            </div>
                                            <div className="p-4 bg-white/70 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                                                <p className="text-sm text-gray-600 font-medium">Project Area</p>
                                                <p className="text-lg font-bold text-purple-900">{selectedRequest.project_area_sqm ? `${parseFloat(selectedRequest.project_area_sqm).toLocaleString()} sqm` : 'N/A'}</p>
                                            </div>
                                            <div className="p-4 bg-white/70 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                                                <p className="text-sm text-gray-600 font-medium">Lot Area</p>
                                                <p className="text-lg font-bold text-purple-900">{selectedRequest.lot_area_sqm ? `${parseFloat(selectedRequest.lot_area_sqm).toLocaleString()} sqm` : 'N/A'}</p>
                                            </div>
                                            <div className="p-4 bg-white/70 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                                                <p className="text-sm text-gray-600 font-medium">Building Area</p>
                                                <p className="text-lg font-bold text-purple-900">{selectedRequest.bldg_improvement_sqm ? `${parseFloat(selectedRequest.bldg_improvement_sqm).toLocaleString()} sqm` : 'N/A'}</p>
                                            </div>
                                            <div className="p-4 bg-white/70 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                                                <p className="text-sm text-gray-600 font-medium">Project Cost</p>
                                                <p className="text-lg font-bold text-purple-900 flex items-center gap-1">
                                                    <DollarSign className="h-4 w-4" />
                                                    {selectedRequest.project_cost ? `₱${parseFloat(selectedRequest.project_cost).toLocaleString()}` : 'N/A'}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-white/70 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                                                <p className="text-sm text-gray-600 font-medium">Right Over Land</p>
                                                <p className="text-lg font-bold text-purple-900">{selectedRequest.right_over_land || 'N/A'}</p>
                                            </div>
                                            <div className="p-4 bg-white/70 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                                                <p className="text-sm text-gray-600 font-medium">Project Duration</p>
                                                <p className="text-lg font-bold text-purple-900">
                                                    {selectedRequest.project_nature_duration || 'N/A'}
                                                    {selectedRequest.project_nature_years && ` (${selectedRequest.project_nature_years} years)`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Row - Land Use & Authorization */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Land Use Information */}
                                    <div className="group hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-500 bg-gradient-to-br from-white via-indigo-50 to-indigo-100 backdrop-blur-sm transform hover:scale-[1.02] rounded-2xl overflow-hidden border border-indigo-200/50">
                                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4">
                                            <h3 className="font-bold text-lg">Land Use & Compliance</h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div className="p-3 bg-white/70 rounded-xl border border-indigo-200">
                                                <p className="text-sm text-gray-600 font-medium">Existing Land Use</p>
                                                <p className="text-lg font-bold text-indigo-900">{selectedRequest.existing_land_use || 'N/A'}</p>
                                            </div>
                                            <div className="p-3 bg-white/70 rounded-xl border border-indigo-200">
                                                <p className="text-sm text-gray-600 font-medium">Written Notice to Tenants</p>
                                                <p className="text-lg font-bold text-indigo-900">{selectedRequest.has_written_notice ? selectedRequest.has_written_notice.toUpperCase() : 'N/A'}</p>
                                            </div>
                                            {selectedRequest.has_written_notice === 'yes' && (
                                                <>
                                                    <div className="p-3 bg-white/70 rounded-xl border border-indigo-200">
                                                        <p className="text-sm text-gray-600 font-medium">Notice Officer</p>
                                                        <p className="text-base font-semibold text-indigo-900">{selectedRequest.notice_officer_name || 'N/A'}</p>
                                                    </div>
                                                    <div className="p-3 bg-white/70 rounded-xl border border-indigo-200">
                                                        <p className="text-sm text-gray-600 font-medium">Notice Dates</p>
                                                        <p className="text-base font-semibold text-indigo-900">{selectedRequest.notice_dates || 'N/A'}</p>
                                                    </div>
                                                </>
                                            )}
                                            <div className="p-3 bg-white/70 rounded-xl border border-indigo-200">
                                                <p className="text-sm text-gray-600 font-medium">Similar Application Filed</p>
                                                <p className="text-lg font-bold text-indigo-900">{selectedRequest.has_similar_application ? selectedRequest.has_similar_application.toUpperCase() : 'N/A'}</p>
                                            </div>
                                            {selectedRequest.has_similar_application === 'yes' && (
                                                <>
                                                    <div className="p-3 bg-white/70 rounded-xl border border-indigo-200">
                                                        <p className="text-sm text-gray-600 font-medium">Application Offices</p>
                                                        <p className="text-base font-semibold text-indigo-900">{selectedRequest.similar_application_offices || 'N/A'}</p>
                                                    </div>
                                                    <div className="p-3 bg-white/70 rounded-xl border border-indigo-200">
                                                        <p className="text-sm text-gray-600 font-medium">Application Dates</p>
                                                        <p className="text-base font-semibold text-indigo-900">{selectedRequest.similar_application_dates || 'N/A'}</p>
                                                    </div>
                                                </>
                                            )}

                                            {/* Release Preference */}
                                            <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl border border-teal-200">
                                                <h4 className="font-bold text-teal-900 mb-3">Release Preference</h4>
                                                <div className="space-y-2">
                                                    <div>
                                                        <p className="text-sm text-gray-600 font-medium">Preferred Mode</p>
                                                        <p className="text-base font-bold text-teal-900 capitalize">{selectedRequest.preferred_release_mode?.replace('_', ' ') || 'N/A'}</p>
                                                    </div>
                                                    {selectedRequest.release_address && (
                                                        <div>
                                                            <p className="text-sm text-gray-600 font-medium">Release Address</p>
                                                            <p className="text-base font-semibold text-teal-900">{selectedRequest.release_address}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Authorization & Documents */}
                                    <div className="group hover:shadow-2xl hover:shadow-amber-500/25 transition-all duration-500 bg-gradient-to-br from-white via-amber-50 to-amber-100 backdrop-blur-sm transform hover:scale-[1.02] rounded-2xl overflow-hidden border border-amber-200/50">
                                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4">
                                            <h3 className="font-bold text-lg">Authorization & Documents</h3>
                                        </div>
                                        <div className="p-6">
                                            {selectedRequest.authorized_representative_name ? (
                                                <div className="space-y-4">
                                                    <div className="p-4 bg-white/70 rounded-xl border border-amber-200">
                                                        <p className="text-sm text-gray-600 font-medium">Representative Name</p>
                                                        <p className="text-lg font-bold text-amber-900">{selectedRequest.authorized_representative_name}</p>
                                                    </div>
                                                    <div className="p-4 bg-white/70 rounded-xl border border-amber-200">
                                                        <p className="text-sm text-gray-600 font-medium">Representative Address</p>
                                                        <p className="text-base font-semibold text-amber-900">{selectedRequest.authorized_representative_address || 'N/A'}</p>
                                                    </div>
                                                    {selectedRequest.authorization_letter_path && (
                                                        <div className="space-y-4">
                                                            <p className="text-sm text-gray-600 font-medium">Authorization Letter</p>

                                                            {/* Enhanced Image Preview */}
                                                            {(selectedRequest.authorization_letter_path.toLowerCase().endsWith('.png') ||
                                                                selectedRequest.authorization_letter_path.toLowerCase().endsWith('.jpg') ||
                                                                selectedRequest.authorization_letter_path.toLowerCase().endsWith('.jpeg')) && (
                                                                    <div className="border-2 border-amber-300 rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                                                                        <img
                                                                            src={`/storage/${selectedRequest.authorization_letter_path}`}
                                                                            alt="Authorization Letter"
                                                                            className="w-full h-auto max-h-64 object-contain"
                                                                        />
                                                                    </div>
                                                                )}

                                                            {/* Enhanced View/Download Button */}
                                                            <a
                                                                href={`/storage/${selectedRequest.authorization_letter_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                                                            >
                                                                <FileText className="h-5 w-5" />
                                                                {(selectedRequest.authorization_letter_path.toLowerCase().endsWith('.png') ||
                                                                    selectedRequest.authorization_letter_path.toLowerCase().endsWith('.jpg') ||
                                                                    selectedRequest.authorization_letter_path.toLowerCase().endsWith('.jpeg'))
                                                                    ? 'View Full Size Document'
                                                                    : 'View Authorization Letter'}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                        <User className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                    <h4 className="font-bold text-gray-700 mb-2">No Authorized Representative</h4>
                                                    <p className="text-sm text-gray-500">This application was submitted directly by the applicant</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Request #{selectedRequest?.id}</DialogTitle>
                        <DialogDescription>
                            Update the evaluation and report details
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Evaluation Status</label>
                            <select
                                value={editData.evaluation}
                                onChange={(e) => setEditData('evaluation', e.target.value)}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                value={editData.description}
                                onChange={(e) => setEditData('description', e.target.value)}
                                className="w-full p-2 border rounded-md"
                                rows="3"
                                placeholder="Enter description"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editData.amount}
                                    onChange={(e) => setEditData('amount', e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date Certified</label>
                                <input
                                    type="date"
                                    value={editData.date_certified}
                                    onChange={(e) => setEditData('date_certified', e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Issued By</label>
                            <input
                                type="text"
                                value={editData.issued_by}
                                onChange={(e) => setEditData('issued_by', e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="Enter issuer name"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editProcessing}>
                                {editProcessing ? 'Updating...' : 'Update'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Request</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete Request #{requestToDelete?.id}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Accept Confirmation Dialog */}
            <Dialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Request</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to approve Request #{requestToAction?.id}? The applicant will be notified via email.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsAcceptDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={confirmAccept}>
                            Approve
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Decline Confirmation Dialog */}
            <Dialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-rose-700">Decline Request</DialogTitle>
                        <DialogDescription>
                            You are about to decline Request #{requestToAction?.id} from {requestToAction?.applicant_name}.
                            Please provide detailed feedback explaining why this request is being rejected. This feedback will be sent to the applicant via email.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div>
                            <label htmlFor="rejection-feedback" className="block text-sm font-medium text-gray-700 mb-2">
                                Rejection Feedback <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="rejection-feedback"
                                value={rejectionFeedback}
                                onChange={(e) => setRejectionFeedback(e.target.value)}
                                placeholder="Please explain why this request is being rejected. Include specific issues that need to be addressed and any requirements that were not met..."
                                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-vertical"
                                maxLength={1000}
                            />
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-xs text-gray-500">
                                    This feedback will be included in the rejection email sent to the applicant.
                                </p>
                                <p className="text-xs text-gray-400">
                                    {rejectionFeedback.length}/1000
                                </p>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <div className="text-amber-600 mt-0.5">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-amber-800">Important</p>
                                    <p className="text-xs text-amber-700">
                                        The applicant will receive an email with your feedback. Please be clear and constructive in your explanation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeclineDialogOpen(false);
                                setRejectionFeedback('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDecline}
                            disabled={!rejectionFeedback.trim()}
                            className="min-w-[100px]"
                        >
                            Decline & Send Email
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Notification Modal */}
            <NotificationModal
                isOpen={notificationModal.isOpen}
                onClose={() => setNotificationModal(prev => ({ ...prev, isOpen: false }))}
                type={notificationModal.type}
                title={notificationModal.title}
                message={notificationModal.message}
                buttonText={notificationModal.buttonText}
            />
        </div>
    );
}

import React, { useState, useMemo } from 'react';
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

export function AdminRequestList({ requests }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { toast } = useToast();
    const { post, processing } = useForm();
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

    const handleDeleteClick = (request) => {
        setRequestToDelete(request);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!requestToDelete) return;

        router.delete(route('admin.delete-request', requestToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Success!",
                    description: "Request deleted successfully!",
                });
                setIsDeleteDialogOpen(false);
                setRequestToDelete(null);
            },
            onError: (errors) => {
                console.error('Delete error:', errors);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to delete request.",
                });
            }
        });
    };

    const handleAcceptClick = (request) => {
        if (!request.report_id) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No report found for this request.",
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
                toast({
                    title: "Success!",
                    description: "Request approved successfully!",
                });
                setIsAcceptDialogOpen(false);
                setRequestToAction(null);
            },
            onError: (errors) => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to approve request.",
                });
            }
        });
    };

    const handleDeclineClick = (request) => {
        if (!request.report_id) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No report found for this request.",
            });
            return;
        }
        setRequestToAction(request);
        setIsDeclineDialogOpen(true);
    };

    const confirmDecline = () => {
        if (!requestToAction) return;

        router.post(route('admin.update-evaluation', requestToAction.report_id), {
            evaluation: 'rejected',
            issued_by: 'Admin',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Request Declined",
                    description: "Request has been rejected.",
                });
                setIsDeclineDialogOpen(false);
                setRequestToAction(null);
            },
            onError: (errors) => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to decline request.",
                });
            }
        });
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
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-purple-50" onClick={() => setFilterStatus('all')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-900">Total Requests</CardTitle>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-700">{stats.total}</div>
                        <p className="text-xs text-purple-600 mt-1">All submissions</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-amber-500 bg-gradient-to-br from-white to-amber-50" onClick={() => setFilterStatus('pending')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-amber-900">Pending</CardTitle>
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-700">{stats.pending}</div>
                        <p className="text-xs text-amber-600 mt-1">Awaiting review</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50" onClick={() => setFilterStatus('approved')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-900">Approved</CardTitle>
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-700">{stats.approved}</div>
                        <p className="text-xs text-emerald-600 mt-1">Successfully processed</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-rose-500 bg-gradient-to-br from-white to-rose-50" onClick={() => setFilterStatus('rejected')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-rose-900">Rejected</CardTitle>
                        <div className="p-2 bg-rose-100 rounded-lg">
                            <XCircle className="h-5 w-5 text-rose-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-rose-700">{stats.rejected}</div>
                        <p className="text-xs text-rose-600 mt-1">Needs attention</p>
                    </CardContent>
                </Card>
            </div>

            {/* Requests Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            All Requests ({filteredRequests.length})
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleExport} className="gap-2">
                                <Download className="h-4 w-4" />
                                Export CSV
                            </Button>
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search requests..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            {filterStatus !== 'all' && (
                                <Button variant="outline" onClick={() => setFilterStatus('all')}>
                                    Clear Filter
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
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
                                {filteredRequests.map((request) => (
                                    <tr key={request.id} className="border-b hover:bg-gray-50">
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

            {/* Request Details Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Request Details #{selectedRequest?.id}</DialogTitle>
                        <DialogDescription>
                            Submitted on {formatDate(selectedRequest?.created_at)}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Basic Info */}
                            <div className="space-y-4">
                                {/* User Info */}
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        User Information
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <p className="text-gray-600">Name</p>
                                            <p className="font-medium">{selectedRequest.user_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Email</p>
                                            <p className="font-medium flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {selectedRequest.user_email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Applicant Info */}
                                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                                    <h3 className="font-semibold text-emerald-900 mb-3">Applicant Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <p className="text-gray-600">Applicant Name</p>
                                            <p className="font-medium">{selectedRequest.applicant_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Corporation</p>
                                            <p className="font-medium">{selectedRequest.corporation_name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Applicant Address</p>
                                            <p className="font-medium">{selectedRequest.applicant_address}</p>
                                        </div>
                                        {selectedRequest.corporation_address && (
                                            <div>
                                                <p className="text-gray-600">Corporation Address</p>
                                                <p className="font-medium">{selectedRequest.corporation_address}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                    <div>
                                        <p className="text-sm text-gray-600">Current Status</p>
                                        <Badge className={`${getStatusColor(selectedRequest.status)} mt-1`}>
                                            <span className="flex items-center gap-1">
                                                {getStatusIcon(selectedRequest.status)}
                                                {(selectedRequest.status || 'pending').charAt(0).toUpperCase() + (selectedRequest.status || 'pending').slice(1)}
                                            </span>
                                        </Badge>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Submitted</p>
                                        <p className="font-medium flex items-center gap-1">
                                            <CalendarDays className="h-3 w-3" />
                                            {formatDate(selectedRequest.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Middle Column - Project & Land Use */}
                            <div className="space-y-4">

                            {/* Project Details */}
                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    Project Details
                                </h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray-600">Project Type</p>
                                        <p className="font-medium">{selectedRequest.project_type || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Project Nature</p>
                                        <p className="font-medium">{selectedRequest.project_nature || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-gray-600 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            Project Location
                                        </p>
                                        <p className="font-medium">{formatLocation(selectedRequest)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Project Area</p>
                                        <p className="font-medium">{selectedRequest.project_area_sqm ? `${parseFloat(selectedRequest.project_area_sqm).toLocaleString()} sqm` : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Lot Area</p>
                                        <p className="font-medium">{selectedRequest.lot_area_sqm ? `${parseFloat(selectedRequest.lot_area_sqm).toLocaleString()} sqm` : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Building/Improvement Area</p>
                                        <p className="font-medium">{selectedRequest.bldg_improvement_sqm ? `${parseFloat(selectedRequest.bldg_improvement_sqm).toLocaleString()} sqm` : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Project Cost</p>
                                        <p className="font-medium flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" />
                                            {selectedRequest.project_cost ? `₱${parseFloat(selectedRequest.project_cost).toLocaleString()}` : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Right Over Land</p>
                                        <p className="font-medium">{selectedRequest.right_over_land || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Project Duration</p>
                                        <p className="font-medium">
                                            {selectedRequest.project_nature_duration || 'N/A'}
                                            {selectedRequest.project_nature_years && ` (${selectedRequest.project_nature_years} years)`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                                {/* Land Use Information */}
                                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                                    <h3 className="font-semibold text-indigo-900 mb-3">Land Use Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <p className="text-gray-600">Existing Land Use</p>
                                            <p className="font-medium">{selectedRequest.existing_land_use || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Written Notice to Tenants</p>
                                            <p className="font-medium">{selectedRequest.has_written_notice ? selectedRequest.has_written_notice.toUpperCase() : 'N/A'}</p>
                                        </div>
                                        {selectedRequest.has_written_notice === 'yes' && (
                                            <>
                                                <div>
                                                    <p className="text-gray-600">Notice Officer Name</p>
                                                    <p className="font-medium">{selectedRequest.notice_officer_name || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Notice Dates</p>
                                                    <p className="font-medium">{selectedRequest.notice_dates || 'N/A'}</p>
                                                </div>
                                            </>
                                        )}
                                        <div>
                                            <p className="text-gray-600">Similar Application Filed</p>
                                            <p className="font-medium">{selectedRequest.has_similar_application ? selectedRequest.has_similar_application.toUpperCase() : 'N/A'}</p>
                                        </div>
                                        {selectedRequest.has_similar_application === 'yes' && (
                                            <>
                                                <div>
                                                    <p className="text-gray-600">Application Offices</p>
                                                    <p className="font-medium">{selectedRequest.similar_application_offices || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Application Dates</p>
                                                    <p className="font-medium">{selectedRequest.similar_application_dates || 'N/A'}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Release Preference */}
                                <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                                    <h3 className="font-semibold text-teal-900 mb-3">Release Preference</h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <p className="text-gray-600">Preferred Release Mode</p>
                                            <p className="font-medium capitalize">{selectedRequest.preferred_release_mode?.replace('_', ' ') || 'N/A'}</p>
                                        </div>
                                        {selectedRequest.release_address && (
                                            <div>
                                                <p className="text-gray-600">Release Address</p>
                                                <p className="font-medium">{selectedRequest.release_address}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Authorization & Documents */}
                            <div className="space-y-4">
                                {/* Authorized Representative Info */}
                                {selectedRequest.authorized_representative_name ? (
                                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                        <h3 className="font-semibold text-amber-900 mb-3">Authorized Representative</h3>
                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <p className="text-gray-600">Representative Name</p>
                                                <p className="font-medium">{selectedRequest.authorized_representative_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Representative Address</p>
                                                <p className="font-medium">{selectedRequest.authorized_representative_address || 'N/A'}</p>
                                            </div>
                                            {selectedRequest.authorization_letter_path && (
                                                <div className="pt-2 space-y-3">
                                                    <p className="text-gray-600 mb-2">Authorization Letter</p>
                                                    
                                                    {/* Image Preview for PNG/JPG/JPEG files */}
                                                    {(selectedRequest.authorization_letter_path.toLowerCase().endsWith('.png') || 
                                                      selectedRequest.authorization_letter_path.toLowerCase().endsWith('.jpg') || 
                                                      selectedRequest.authorization_letter_path.toLowerCase().endsWith('.jpeg')) && (
                                                        <div className="border-2 border-amber-300 rounded-lg overflow-hidden bg-white">
                                                            <img 
                                                                src={`/storage/${selectedRequest.authorization_letter_path}`}
                                                                alt="Authorization Letter"
                                                                className="w-full h-auto"
                                                            />
                                                        </div>
                                                    )}
                                                    
                                                    {/* View/Download Button */}
                                                    <a 
                                                        href={`/storage/${selectedRequest.authorization_letter_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-amber-400 rounded-lg hover:bg-amber-100 transition-colors font-medium text-amber-900"
                                                    >
                                                        <FileText className="h-5 w-5" />
                                                        {(selectedRequest.authorization_letter_path.toLowerCase().endsWith('.png') || 
                                                          selectedRequest.authorization_letter_path.toLowerCase().endsWith('.jpg') || 
                                                          selectedRequest.authorization_letter_path.toLowerCase().endsWith('.jpeg')) 
                                                            ? 'View Full Size' 
                                                            : 'View Authorization Letter'}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <h3 className="font-semibold text-gray-700 mb-2">Authorized Representative</h3>
                                        <p className="text-sm text-gray-500">No authorized representative assigned</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Decline Request</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to decline Request #{requestToAction?.id}? The applicant will be notified.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsDeclineDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDecline}>
                            Decline
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

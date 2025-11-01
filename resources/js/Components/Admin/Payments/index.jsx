import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { NotificationModal } from '@/Components/ui/notification-modal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { 
    CheckCircle2, 
    XCircle, 
    Clock, 
    FileText, 
    Search,
    MoreVertical,
    Eye,
    ThumbsUp,
    ThumbsDown,
    DollarSign,
    Calendar,
    Download
} from 'lucide-react';
import { router } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';

export function AdminPaymentList({ payments }) {
    const paymentsData = payments?.data || [];
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [notificationModal, setNotificationModal] = useState({
        isOpen: false,
        type: "success",
        title: "",
        message: "",
        buttonText: "Continue"
    });
    const { toast } = useToast();

    const getStatusColor = (status) => {
        switch (status) {
            case 'verified':
                return 'bg-emerald-100 text-emerald-800 border-emerald-300';
            case 'rejected':
                return 'bg-rose-100 text-rose-800 border-rose-300';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-300';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'verified':
                return <CheckCircle2 className="h-4 w-4" />;
            case 'rejected':
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const handleVerifyClick = (payment) => {
        setSelectedPayment(payment);
        setIsVerifyDialogOpen(true);
    };

    const confirmVerify = () => {
        if (!selectedPayment) return;

        router.post(route('admin.payments.verify', selectedPayment.id), {}, {
            onSuccess: () => {
                setIsVerifyDialogOpen(false);
                setSelectedPayment(null);
                setNotificationModal({
                    isOpen: true,
                    type: "success",
                    title: "Payment Verified!",
                    message: `Payment for Request #${selectedPayment.request_id} has been verified successfully. The certificate has been generated and the applicant will be notified via email.`,
                    buttonText: "Continue"
                });
            },
            onError: () => {
                setIsVerifyDialogOpen(false);
                setNotificationModal({
                    isOpen: true,
                    type: "error",
                    title: "Verification Failed!",
                    message: "Failed to verify the payment. Please try again or contact support if the problem persists.",
                    buttonText: "Try Again"
                });
            }
        });
    };

    const handleRejectClick = (payment) => {
        setSelectedPayment(payment);
        setIsRejectDialogOpen(true);
    };

    const handleRejectSubmit = () => {
        if (!rejectionReason.trim()) {
            setNotificationModal({
                isOpen: true,
                type: "warning",
                title: "Rejection Reason Required",
                message: "Please provide a reason for rejecting this payment. This feedback will be sent to the applicant to help them understand what needs to be corrected.",
                buttonText: "OK"
            });
            return;
        }

        router.post(route('admin.payments.reject', selectedPayment.id), {
            rejection_reason: rejectionReason
        }, {
            onSuccess: () => {
                setIsRejectDialogOpen(false);
                setRejectionReason('');
                setNotificationModal({
                    isOpen: true,
                    type: "success",
                    title: "Payment Rejected!",
                    message: `Payment for Request #${selectedPayment.request_id} has been rejected. The applicant has been notified via email with your feedback.`,
                    buttonText: "Continue"
                });
            },
            onError: () => {
                setIsRejectDialogOpen(false);
                setNotificationModal({
                    isOpen: true,
                    type: "error",
                    title: "Rejection Failed!",
                    message: "Failed to reject the payment. Please try again or contact support if the problem persists.",
                    buttonText: "Try Again"
                });
            }
        });
    };

    const handleView = (payment) => {
        setSelectedPayment(payment);
        setIsViewDialogOpen(true);
    };

    const filteredPayments = useMemo(() => {
        let filtered = paymentsData;

        if (filterStatus !== 'all') {
            filtered = filtered.filter(p => p.payment_status === filterStatus);
        }

        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.receipt_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.id?.toString().includes(searchTerm)
            );
        }

        return filtered;
    }, [paymentsData, filterStatus, searchTerm]);

    const stats = useMemo(() => {
        return {
            total: paymentsData.length,
            pending: paymentsData.filter(p => p.payment_status === 'pending').length,
            verified: paymentsData.filter(p => p.payment_status === 'verified').length,
            rejected: paymentsData.filter(p => p.payment_status === 'rejected').length,
        };
    }, [paymentsData]);
    
    const handleExport = () => {
        const url = route('admin.export.payments', { status: filterStatus });
        window.location.href = url;
        toast({
            title: "Export Started",
            description: "Your CSV file will download shortly.",
        });
    };
    
    const handlePageChange = (url) => {
        if (url) {
            router.get(url, {}, { preserveState: true, preserveScroll: true });
        }
    };
    
    const renderPaginationLinks = () => {
        if (!payments?.links || payments.links.length <= 3) return null;
        
        return (
            <Pagination className="mt-6">
                <PaginationContent>
                    {payments.links.map((link, index) => {
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
                        
                        if (index === payments.links.length - 1) {
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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
                        <CardTitle className="text-sm font-semibold text-purple-900 group-hover:text-purple-800 transition-colors">Total Payments</CardTitle>
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                            <DollarSign className="h-5 w-5 text-white" />
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
                        <p className="text-sm text-amber-600 group-hover:text-amber-700 transition-colors">Awaiting verification</p>
                    </CardContent>
                </Card>

                <Card className="group hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 cursor-pointer border-0 bg-gradient-to-br from-white via-emerald-50 to-emerald-100 backdrop-blur-sm transform hover:scale-105 hover:-translate-y-2 rounded-2xl overflow-hidden relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-emerald-500/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500" onClick={() => setFilterStatus('verified')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                        <CardTitle className="text-sm font-semibold text-emerald-900 group-hover:text-emerald-800 transition-colors">Verified</CardTitle>
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300 group-hover:scale-110">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-4xl font-bold text-emerald-700 group-hover:text-emerald-800 transition-colors mb-2">{stats.verified}</div>
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

            {/* Payments Table */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3 text-xl font-bold">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <FileText className="h-6 w-6" />
                            </div>
                            Payment Submissions ({filteredPayments.length})
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
                                    placeholder="Search payments..."
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
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3 font-semibold">ID</th>
                                    <th className="text-left p-3 font-semibold">Applicant</th>
                                    <th className="text-left p-3 font-semibold">Amount</th>
                                    <th className="text-left p-3 font-semibold">Method</th>
                                    <th className="text-left p-3 font-semibold">Date</th>
                                    <th className="text-left p-3 font-semibold">Status</th>
                                    <th className="text-left p-3 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-mono text-sm">#{payment.id}</td>
                                        <td className="p-3">
                                            <div>
                                                <p className="font-medium">{payment.applicant_name}</p>
                                                <p className="text-xs text-gray-500">Request #{payment.request_id}</p>
                                            </div>
                                        </td>
                                        <td className="p-3 font-semibold">₱{parseFloat(payment.amount).toLocaleString()}</td>
                                        <td className="p-3 text-sm capitalize">{payment.payment_method.replace('_', ' ')}</td>
                                        <td className="p-3 text-sm">{formatDate(payment.payment_date)}</td>
                                        <td className="p-3">
                                            <Badge className={getStatusColor(payment.payment_status)}>
                                                <span className="flex items-center gap-1">
                                                    {getStatusIcon(payment.payment_status)}
                                                    {payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
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
                                                    <DropdownMenuItem onClick={() => handleView(payment)}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    {payment.payment_status === 'pending' && (
                                                        <>
                                                            <DropdownMenuItem
                                                                onClick={() => handleVerifyClick(payment)}
                                                                className="text-emerald-600"
                                                            >
                                                                <ThumbsUp className="h-4 w-4 mr-2" />
                                                                Verify Payment
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleRejectClick(payment)}
                                                                className="text-rose-600"
                                                            >
                                                                <ThumbsDown className="h-4 w-4 mr-2" />
                                                                Reject Payment
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
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

            {/* Payment Details Modal - Enhanced Landscape Layout */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-[80vw] w-full max-h-[80vh] overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 border-0 shadow-2xl rounded-3xl">
                    {/* Modal Header with Gradient Background */}
                    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-6 -m-6 mb-6 rounded-t-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <DollarSign className="h-6 w-6" />
                                </div>
                                Payment Details #{selectedPayment?.id}
                            </DialogTitle>
                            <DialogDescription className="text-emerald-100 text-lg">
                                Submitted on {formatDate(selectedPayment?.created_at)} • Status: {selectedPayment?.payment_status?.charAt(0).toUpperCase() + selectedPayment?.payment_status?.slice(1)}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="overflow-y-auto max-h-[calc(80vh-200px)] pr-2">
                        {selectedPayment && (
                            <div className="space-y-8">
                                {/* Top Row - Payment Info & Status */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Payment Information Card */}
                                    <div className="group hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 bg-gradient-to-br from-white via-blue-50 to-blue-100 backdrop-blur-sm transform hover:scale-[1.02] rounded-2xl overflow-hidden border border-blue-200/50">
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                <FileText className="h-5 w-5" />
                                                Payment Information
                                            </h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div className="p-3 bg-white/70 rounded-xl border border-blue-200">
                                                <p className="text-sm text-gray-600 font-medium">Applicant Name</p>
                                                <p className="text-lg font-bold text-blue-900">{selectedPayment.applicant_name}</p>
                                            </div>
                                            <div className="p-3 bg-white/70 rounded-xl border border-blue-200">
                                                <p className="text-sm text-gray-600 font-medium">Email Address</p>
                                                <p className="text-base font-semibold text-blue-900">{selectedPayment.applicant_email || 'N/A'}</p>
                                            </div>
                                            <div className="p-3 bg-white/70 rounded-xl border border-blue-200">
                                                <p className="text-sm text-gray-600 font-medium">Request ID</p>
                                                <p className="text-lg font-bold text-blue-900 font-mono">#{selectedPayment.request_id}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Transaction Details Card */}
                                    <div className="group hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 bg-gradient-to-br from-white via-purple-50 to-purple-100 backdrop-blur-sm transform hover:scale-[1.02] rounded-2xl overflow-hidden border border-purple-200/50">
                                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4">
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                <Calendar className="h-5 w-5" />
                                                Transaction Details
                                            </h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div className="p-3 bg-white/70 rounded-xl border border-purple-200">
                                                <p className="text-sm text-gray-600 font-medium">Payment Method</p>
                                                <p className="text-lg font-bold text-purple-900 capitalize">{selectedPayment.payment_method.replace('_', ' ')}</p>
                                            </div>
                                            <div className="p-3 bg-white/70 rounded-xl border border-purple-200">
                                                <p className="text-sm text-gray-600 font-medium">Receipt Number</p>
                                                <p className="text-base font-semibold text-purple-900 font-mono">{selectedPayment.receipt_number || 'N/A'}</p>
                                            </div>
                                            <div className="p-3 bg-white/70 rounded-xl border border-purple-200">
                                                <p className="text-sm text-gray-600 font-medium">Payment Date</p>
                                                <p className="text-lg font-bold text-purple-900">{formatDate(selectedPayment.payment_date)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status & Amount Card */}
                                    <div className="group hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 bg-gradient-to-br from-white via-emerald-50 to-emerald-100 backdrop-blur-sm transform hover:scale-[1.02] rounded-2xl overflow-hidden border border-emerald-200/50">
                                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4">
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                <DollarSign className="h-5 w-5" />
                                                Payment Status
                                            </h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div className="text-center p-4 bg-white/70 rounded-xl border border-emerald-200">
                                                <p className="text-sm text-gray-600 font-medium mb-2">Current Status</p>
                                                <Badge className={`${getStatusColor(selectedPayment.payment_status)} text-lg px-4 py-2`}>
                                                    <span className="flex items-center gap-2">
                                                        {getStatusIcon(selectedPayment.payment_status)}
                                                        {selectedPayment.payment_status.charAt(0).toUpperCase() + selectedPayment.payment_status.slice(1)}
                                                    </span>
                                                </Badge>
                                            </div>
                                            <div className="text-center p-4 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-xl border border-emerald-300">
                                                <p className="text-sm text-gray-600 font-medium mb-2">Total Amount</p>
                                                <p className="text-3xl font-bold text-emerald-900">₱{parseFloat(selectedPayment.amount).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Summary - Full Width */}
                                <div className="group hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-500 bg-gradient-to-br from-white via-indigo-50 to-indigo-100 backdrop-blur-sm transform hover:scale-[1.01] rounded-2xl overflow-hidden border border-indigo-200/50">
                                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4">
                                        <h3 className="font-bold text-xl flex items-center gap-3">
                                            <FileText className="h-6 w-6" />
                                            Payment Breakdown & Summary
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div className="p-4 bg-white/70 rounded-xl border border-indigo-200 hover:shadow-lg transition-all duration-300">
                                                <p className="text-sm text-gray-600 font-medium">Payment ID</p>
                                                <p className="text-xl font-bold text-indigo-900 font-mono">#{selectedPayment.id}</p>
                                            </div>
                                            <div className="p-4 bg-white/70 rounded-xl border border-indigo-200 hover:shadow-lg transition-all duration-300">
                                                <p className="text-sm text-gray-600 font-medium">Subtotal</p>
                                                <p className="text-xl font-bold text-indigo-900">₱{parseFloat(selectedPayment.amount).toLocaleString()}</p>
                                            </div>
                                            <div className="p-4 bg-white/70 rounded-xl border border-indigo-200 hover:shadow-lg transition-all duration-300">
                                                <p className="text-sm text-gray-600 font-medium">Processing Fee</p>
                                                <p className="text-xl font-bold text-indigo-900">₱0.00</p>
                                            </div>
                                            <div className="p-4 bg-gradient-to-r from-indigo-200 to-indigo-300 rounded-xl border border-indigo-400 hover:shadow-lg transition-all duration-300">
                                                <p className="text-sm text-indigo-800 font-medium">Total Amount</p>
                                                <p className="text-2xl font-bold text-indigo-900">₱{parseFloat(selectedPayment.amount).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Row - Receipt & Additional Info */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Receipt Document */}
                                    <div className="group hover:shadow-2xl hover:shadow-amber-500/25 transition-all duration-500 bg-gradient-to-br from-white via-amber-50 to-amber-100 backdrop-blur-sm transform hover:scale-[1.02] rounded-2xl overflow-hidden border border-amber-200/50">
                                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4">
                                            <h3 className="font-bold text-lg">Receipt Document</h3>
                                        </div>
                                        <div className="p-6">
                                            {selectedPayment.receipt_file_path ? (
                                                <div className="space-y-4">
                                                    {/* Enhanced Receipt Preview */}
                                                    {(selectedPayment.receipt_file_path.toLowerCase().endsWith('.png') || 
                                                      selectedPayment.receipt_file_path.toLowerCase().endsWith('.jpg') || 
                                                      selectedPayment.receipt_file_path.toLowerCase().endsWith('.jpeg')) && (
                                                        <div className="border-2 border-amber-300 rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                                                            <img 
                                                                src={`/storage/${selectedPayment.receipt_file_path}`}
                                                                alt="Payment Receipt"
                                                                className="w-full h-auto max-h-64 object-contain"
                                                            />
                                                        </div>
                                                    )}
                                                    
                                                    {/* Enhanced View Button */}
                                                    <a 
                                                        href={`/storage/${selectedPayment.receipt_file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                        View Receipt Document
                                                    </a>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                        <FileText className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                    <h4 className="font-bold text-gray-700 mb-2">No Receipt Uploaded</h4>
                                                    <p className="text-sm text-gray-500">No receipt document was provided with this payment</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Additional Information */}
                                    <div className="group hover:shadow-2xl hover:shadow-teal-500/25 transition-all duration-500 bg-gradient-to-br from-white via-teal-50 to-teal-100 backdrop-blur-sm transform hover:scale-[1.02] rounded-2xl overflow-hidden border border-teal-200/50">
                                        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4">
                                            <h3 className="font-bold text-lg">Additional Information</h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {/* Submission Date */}
                                            <div className="p-4 bg-white/70 rounded-xl border border-teal-200">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="h-5 w-5 text-teal-600" />
                                                    <div>
                                                        <p className="text-sm text-gray-600 font-medium">Submission Date</p>
                                                        <p className="text-lg font-bold text-teal-900">{formatDate(selectedPayment.created_at)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Notes */}
                                            {selectedPayment.notes && (
                                                <div className="p-4 bg-white/70 rounded-xl border border-teal-200">
                                                    <p className="text-sm text-gray-600 font-medium mb-2">Notes</p>
                                                    <p className="text-base text-teal-900 leading-relaxed">{selectedPayment.notes}</p>
                                                </div>
                                            )}

                                            {/* Rejection Reason */}
                                            {selectedPayment.rejection_reason && (
                                                <div className="p-4 bg-gradient-to-r from-rose-100 to-rose-200 rounded-xl border border-rose-300">
                                                    <p className="text-sm text-rose-800 font-bold mb-2">Rejection Reason</p>
                                                    <p className="text-base text-rose-900 leading-relaxed">{selectedPayment.rejection_reason}</p>
                                                </div>
                                            )}

                                            {/* Verification Info */}
                                            {selectedPayment.verified_by_name && (
                                                <div className="p-4 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-xl border border-emerald-300">
                                                    <p className="text-sm text-emerald-800 font-bold mb-2">Verification Information</p>
                                                    <p className="text-base text-emerald-900">
                                                        Verified by <span className="font-bold">{selectedPayment.verified_by_name}</span>
                                                    </p>
                                                    <p className="text-sm text-emerald-700 mt-1">
                                                        on {formatDate(selectedPayment.verified_at)}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Default message if no additional info */}
                                            {!selectedPayment.notes && !selectedPayment.rejection_reason && !selectedPayment.verified_by_name && (
                                                <div className="text-center py-8">
                                                    <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                                        <FileText className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                    <p className="text-sm text-gray-500">No additional information available</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Footer */}
                    <div className="border-t bg-white/50 backdrop-blur-sm p-4 -m-6 mt-6 rounded-b-3xl">
                        <div className="flex justify-end">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsViewDialogOpen(false)}
                                className="px-8 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold"
                            >
                                Close Details
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Verify Confirmation Dialog */}
            <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Verify Payment</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to verify this payment? This will automatically generate and send the certificate to the applicant.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPayment && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                            <p className="text-sm"><strong>Payment ID:</strong> #{selectedPayment.id}</p>
                            <p className="text-sm"><strong>Applicant:</strong> {selectedPayment.applicant_name}</p>
                            <p className="text-sm"><strong>Amount:</strong> ₱{parseFloat(selectedPayment.amount).toLocaleString()}</p>
                            <p className="text-sm"><strong>Method:</strong> {selectedPayment.payment_method.replace('_', ' ')}</p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsVerifyDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={confirmVerify}>
                            Verify & Generate Certificate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Payment</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this payment. The applicant will be able to resubmit.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="rejection_reason">Rejection Reason *</Label>
                            <Textarea
                                id="rejection_reason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter reason for rejection..."
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleRejectSubmit}>
                            Reject Payment
                        </Button>
                    </DialogFooter>
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

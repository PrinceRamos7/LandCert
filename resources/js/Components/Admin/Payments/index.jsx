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
                toast({
                    title: "Success!",
                    description: "Payment verified and certificate generated successfully!",
                });
                setIsVerifyDialogOpen(false);
                setSelectedPayment(null);
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to verify payment.",
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
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please provide a rejection reason.",
            });
            return;
        }

        router.post(route('admin.payments.reject', selectedPayment.id), {
            rejection_reason: rejectionReason
        }, {
            onSuccess: () => {
                toast({
                    title: "Payment Rejected",
                    description: "Payment has been rejected.",
                });
                setIsRejectDialogOpen(false);
                setRejectionReason('');
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to reject payment.",
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
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-purple-500" onClick={() => setFilterStatus('all')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                        <DollarSign className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-700">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-amber-500" onClick={() => setFilterStatus('pending')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-5 w-5 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-700">{stats.pending}</div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-emerald-500" onClick={() => setFilterStatus('verified')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Verified</CardTitle>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-700">{stats.verified}</div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-rose-500" onClick={() => setFilterStatus('rejected')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        <XCircle className="h-5 w-5 text-rose-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-rose-700">{stats.rejected}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Payments Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Payment Submissions ({filteredPayments.length})
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleExport} className="gap-2">
                                <Download className="h-4 w-4" />
                                Export CSV
                            </Button>
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search payments..."
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

            {/* View Details Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="border-b pb-4">
                        <DialogTitle className="text-2xl font-bold">Payment Details</DialogTitle>
                    </DialogHeader>
                    {selectedPayment && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                            {/* Left Column - Payment Information */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Payment Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Applicant Name</p>
                                            <p className="font-semibold text-gray-900">{selectedPayment.applicant_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Email</p>
                                            <p className="font-medium text-gray-900">{selectedPayment.applicant_email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Request ID</p>
                                            <p className="font-medium text-gray-900">#{selectedPayment.request_id}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Transaction Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Payment Method</span>
                                            <span className="font-medium text-gray-900 capitalize">{selectedPayment.payment_method.replace('_', ' ')}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Receipt Number</span>
                                            <span className="font-medium text-gray-900">{selectedPayment.receipt_number || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Payment Date</span>
                                            <span className="font-medium text-gray-900">{formatDate(selectedPayment.payment_date)}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t">
                                            <span className="text-sm text-gray-500">Status</span>
                                            <Badge className={getStatusColor(selectedPayment.payment_status)}>
                                                <span className="flex items-center gap-1">
                                                    {getStatusIcon(selectedPayment.payment_status)}
                                                    {selectedPayment.payment_status.charAt(0).toUpperCase() + selectedPayment.payment_status.slice(1)}
                                                </span>
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {selectedPayment.notes && (
                                    <div className="border-t pt-6">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</h3>
                                        <p className="text-gray-700 text-sm leading-relaxed">{selectedPayment.notes}</p>
                                    </div>
                                )}

                                {selectedPayment.rejection_reason && (
                                    <div className="border-t pt-6">
                                        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                                            <h3 className="text-sm font-semibold text-rose-800 uppercase tracking-wide mb-2">Rejection Reason</h3>
                                            <p className="text-rose-700 text-sm leading-relaxed">{selectedPayment.rejection_reason}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedPayment.verified_by_name && (
                                    <div className="border-t pt-6">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Verification Info</h3>
                                        <p className="text-gray-700 text-sm">
                                            Verified by <span className="font-semibold">{selectedPayment.verified_by_name}</span> on {formatDate(selectedPayment.verified_at)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Order Summary */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Payment Summary</h3>
                                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                                        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                            <span className="text-gray-600">Payment ID</span>
                                            <span className="font-mono font-semibold text-gray-900">#{selectedPayment.id}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-semibold text-gray-900">₱{parseFloat(selectedPayment.amount).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                            <span className="text-gray-600">Processing Fee</span>
                                            <span className="font-semibold text-gray-900">₱0</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-lg font-semibold text-gray-900">Total</span>
                                            <span className="text-2xl font-bold text-gray-900">₱{parseFloat(selectedPayment.amount).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {selectedPayment.receipt_file_path && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Receipt Document</h3>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                            <p className="text-sm text-gray-600 mb-4">Receipt file uploaded</p>
                                            <Button variant="outline" className="w-full" asChild>
                                                <a href={`/storage/${selectedPayment.receipt_file_path}`} target="_blank" rel="noopener noreferrer">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Receipt
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-blue-900 mb-1">Submission Date</p>
                                            <p className="text-sm text-blue-700">{formatDate(selectedPayment.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="border-t pt-4 mt-6">
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
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
        </div>
    );
}

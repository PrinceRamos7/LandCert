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
    Calendar
} from 'lucide-react';
import { router } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';

export function AdminPaymentList({ payments = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
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

    const handleVerify = (payment) => {
        if (!confirm('Are you sure you want to verify this payment?')) return;

        router.post(route('admin.payments.verify', payment.id), {}, {
            onSuccess: () => {
                toast({
                    title: "Success!",
                    description: "Payment verified successfully!",
                });
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
        let filtered = payments;

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
    }, [payments, filterStatus, searchTerm]);

    const stats = useMemo(() => {
        return {
            total: payments.length,
            pending: payments.filter(p => p.payment_status === 'pending').length,
            verified: payments.filter(p => p.payment_status === 'verified').length,
            rejected: payments.filter(p => p.payment_status === 'rejected').length,
        };
    }, [payments]);

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
                                                                onClick={() => handleVerify(payment)}
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
                </CardContent>
            </Card>

            {/* View Details Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Payment Details #{selectedPayment?.id}</DialogTitle>
                        <DialogDescription>
                            Submitted on {formatDate(selectedPayment?.created_at)}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPayment && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-gray-600">Applicant Name</Label>
                                    <p className="font-medium">{selectedPayment.applicant_name}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-600">Request ID</Label>
                                    <p className="font-medium">#{selectedPayment.request_id}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-600">Amount</Label>
                                    <p className="font-medium text-lg">₱{parseFloat(selectedPayment.amount).toLocaleString()}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-600">Payment Method</Label>
                                    <p className="font-medium capitalize">{selectedPayment.payment_method.replace('_', ' ')}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-600">Receipt Number</Label>
                                    <p className="font-medium">{selectedPayment.receipt_number || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-600">Payment Date</Label>
                                    <p className="font-medium">{formatDate(selectedPayment.payment_date)}</p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-gray-600">Status</Label>
                                    <div className="mt-1">
                                        <Badge className={getStatusColor(selectedPayment.payment_status)}>
                                            {selectedPayment.payment_status.charAt(0).toUpperCase() + selectedPayment.payment_status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                                {selectedPayment.notes && (
                                    <div className="col-span-2">
                                        <Label className="text-gray-600">Notes</Label>
                                        <p className="font-medium">{selectedPayment.notes}</p>
                                    </div>
                                )}
                                {selectedPayment.rejection_reason && (
                                    <div className="col-span-2 p-3 bg-rose-50 border border-rose-200 rounded-md">
                                        <Label className="text-rose-800">Rejection Reason</Label>
                                        <p className="text-rose-700 mt-1">{selectedPayment.rejection_reason}</p>
                                    </div>
                                )}
                                {selectedPayment.verified_by_name && (
                                    <div className="col-span-2">
                                        <Label className="text-gray-600">Verified By</Label>
                                        <p className="font-medium">{selectedPayment.verified_by_name} on {formatDate(selectedPayment.verified_at)}</p>
                                    </div>
                                )}
                            </div>
                            {selectedPayment.receipt_file_path && (
                                <div className="border-t pt-4">
                                    <Label className="text-gray-600 mb-2 block">Receipt File</Label>
                                    <Button variant="outline" asChild>
                                        <a href={`/storage/${selectedPayment.receipt_file_path}`} target="_blank" rel="noopener noreferrer">
                                            <FileText className="h-4 w-4 mr-2" />
                                            View Receipt
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Payment</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this payment.
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

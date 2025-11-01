import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Upload, FileText, CheckCircle2, XCircle, Clock, DollarSign, Calendar, Loader2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';

export function ReceiptList({ requests = [] }) {
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        payment_method: 'cash',
        receipt_number: '',
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
        receipt_file: null,
        other_method: '',
    });
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

    const handleUploadClick = (request) => {
        setSelectedRequest(request);
        setIsUploadDialogOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, receipt_file: file });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.receipt_file) {
            setNotificationModal({
                isOpen: true,
                type: "warning",
                title: "Receipt File Required",
                message: "Please upload a receipt file to proceed with your payment submission.",
                buttonText: "OK"
            });
            return;
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setNotificationModal({
                isOpen: true,
                type: "warning",
                title: "Invalid Amount",
                message: "Please enter a valid payment amount greater than zero.",
                buttonText: "OK"
            });
            return;
        }

        // Validate receipt number for non-cash payments
        if (formData.payment_method !== 'cash' && !formData.receipt_number) {
            setNotificationModal({
                isOpen: true,
                type: "warning",
                title: "Receipt Number Required",
                message: "Receipt or reference number is required for non-cash payments. Please provide the transaction reference.",
                buttonText: "OK"
            });
            return;
        }

        // Validate other payment method specification
        if (formData.payment_method === 'other' && !formData.other_method.trim()) {
            setNotificationModal({
                isOpen: true,
                type: "warning",
                title: "Payment Method Required",
                message: "Please specify the payment method you used for this transaction.",
                buttonText: "OK"
            });
            return;
        }

        // Show confirmation dialog
        setIsConfirmDialogOpen(true);
    };

    const confirmSubmit = () => {
        if (isSubmitting) return; // Prevent double submission
        
        setIsSubmitting(true);
        
        const data = new FormData();
        data.append('request_id', selectedRequest.id);
        data.append('amount', formData.amount);
        data.append('payment_method', formData.payment_method);
        data.append('receipt_number', formData.receipt_number);
        data.append('payment_date', formData.payment_date);
        data.append('notes', formData.notes);
        data.append('receipt_file', formData.receipt_file);

        router.post(route('receipt.store'), data, {
            onSuccess: () => {
                setIsUploadDialogOpen(false);
                setIsConfirmDialogOpen(false);
                setIsSubmitting(false);
                setFormData({
                    amount: '',
                    payment_method: 'cash',
                    receipt_number: '',
                    payment_date: new Date().toISOString().split('T')[0],
                    notes: '',
                    receipt_file: null,
                });
                setNotificationModal({
                    isOpen: true,
                    type: "success",
                    title: "Receipt Submitted!",
                    message: `Your payment receipt for Request #${selectedRequest.id} has been submitted successfully! Please wait for admin verification. You will receive an email notification once your payment is verified.`,
                    buttonText: "Continue"
                });
            },
            onError: (errors) => {
                setIsConfirmDialogOpen(false);
                setIsSubmitting(false);
                setNotificationModal({
                    isOpen: true,
                    type: "error",
                    title: "Submission Failed!",
                    message: "Failed to submit your payment receipt. Please check your information and try again. If the problem persists, contact support.",
                    buttonText: "Try Again"
                });
            }
        });
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
            <Card>
                <CardHeader>
                    <CardTitle>Payment Receipts</CardTitle>
                    <CardDescription>
                        Upload payment receipts for your approved applications
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {requests.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500">No approved applications found</p>
                            <p className="text-sm text-gray-400 mt-2">
                                Applications must be approved before you can submit payment
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((request, index) => (
                                <Card key={`request-${request.id}-${request.payment_id || index}`} className="border-l-4 border-l-purple-500">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-lg">
                                                        Request #{request.id}
                                                    </h3>
                                                    {request.payment_status === 'verified' && (
                                                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                                                            <span className="flex items-center gap-1">
                                                                <CheckCircle2 className="h-4 w-4" />
                                                                Verified
                                                            </span>
                                                        </Badge>
                                                    )}
                                                    {request.payment_status && request.payment_status !== 'verified' && (
                                                        <Badge className={getStatusColor(request.payment_status)}>
                                                            <span className="flex items-center gap-1">
                                                                {getStatusIcon(request.payment_status)}
                                                                {request.payment_status.charAt(0).toUpperCase() + request.payment_status.slice(1)}
                                                            </span>
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-1">
                                                    <strong>Applicant:</strong> {request.applicant_name}
                                                </p>
                                                <p className="text-sm text-gray-600 mb-1">
                                                    <strong>Project:</strong> {request.project_type || 'N/A'}
                                                </p>
                                                {request.payment_amount && (
                                                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                                                        <DollarSign className="h-4 w-4" />
                                                        <strong>Amount Paid:</strong> ₱{parseFloat(request.payment_amount).toLocaleString()}
                                                    </p>
                                                )}
                                                {request.payment_date && (
                                                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <strong>Payment Date:</strong> {formatDate(request.payment_date)}
                                                    </p>
                                                )}
                                                {request.payment_status === 'verified' && request.certificate_number && (
                                                    <div className="mt-3 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                                            <span className="font-semibold text-emerald-800">Certificate Information</span>
                                                        </div>
                                                        <p className="text-sm text-emerald-800 mb-1">
                                                            <strong>Certificate Number:</strong> {request.certificate_number}
                                                        </p>
                                                        <p className="text-sm text-emerald-800">
                                                            <strong>Issued:</strong> {formatDate(request.issued_at)}
                                                        </p>
                                                    </div>
                                                )}
                                                {request.rejection_reason && (
                                                    <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-md">
                                                        <p className="text-sm text-rose-800">
                                                            <strong>Rejection Reason:</strong> {request.rejection_reason}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {request.payment_status === 'verified' && request.certificate_id ? (
                                                    <>
                                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2" asChild>
                                                            <a href={route('certificate.download', request.certificate_id)}>
                                                                <FileText className="h-4 w-4 mr-2" />
                                                                Download Certificate
                                                            </a>
                                                        </Button>
                                                        {request.receipt_file_path && (
                                                            <Button variant="outline" size="sm" asChild>
                                                                <a href={`/storage/${request.receipt_file_path}`} target="_blank" rel="noopener noreferrer">
                                                                    <FileText className="h-4 w-4 mr-2" />
                                                                    View Receipt
                                                                </a>
                                                            </Button>
                                                        )}
                                                    </>
                                                ) : !request.payment_id || request.payment_status === 'rejected' ? (
                                                    <Button onClick={() => handleUploadClick(request)}>
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        {request.payment_status === 'rejected' ? 'Resubmit' : 'Upload Receipt'}
                                                    </Button>
                                                ) : request.payment_status === 'pending' ? (
                                                    <>
                                                        <Badge variant="outline" className="text-blue-600">
                                                            Awaiting Verification
                                                        </Badge>
                                                        {request.receipt_file_path && (
                                                            <Button variant="outline" size="sm" asChild>
                                                                <a href={`/storage/${request.receipt_file_path}`} target="_blank" rel="noopener noreferrer">
                                                                    <FileText className="h-4 w-4 mr-2" />
                                                                    View Receipt
                                                                </a>
                                                            </Button>
                                                        )}
                                                    </>
                                                ) : request.payment_status === 'verified' ? (
                                                    <>
                                                        <Badge variant="outline" className="text-emerald-600">
                                                            Payment Verified ✓
                                                        </Badge>
                                                        {request.receipt_file_path && (
                                                            <Button variant="outline" size="sm" asChild>
                                                                <a href={`/storage/${request.receipt_file_path}`} target="_blank" rel="noopener noreferrer">
                                                                    <FileText className="h-4 w-4 mr-2" />
                                                                    View Receipt
                                                                </a>
                                                            </Button>
                                                        )}
                                                    </>
                                                ) : request.receipt_file_path ? (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={`/storage/${request.receipt_file_path}`} target="_blank" rel="noopener noreferrer">
                                                            <FileText className="h-4 w-4 mr-2" />
                                                            View Receipt
                                                        </a>
                                                    </Button>
                                                ) : null}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Upload Dialog */}
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Upload Payment Receipt</DialogTitle>
                        <DialogDescription>
                            Request #{selectedRequest?.id} - {selectedRequest?.applicant_name}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount Paid *</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="payment_method">Payment Method *</Label>
                                <Select
                                    value={formData.payment_method}
                                    onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                        <SelectItem value="gcash">GCash</SelectItem>
                                        <SelectItem value="paymaya">PayMaya</SelectItem>
                                        <SelectItem value="check">Check</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="receipt_number">
                                    Receipt/Reference Number {formData.payment_method !== 'cash' && <span className="text-red-500">*</span>}
                                </Label>
                                <Input
                                    id="receipt_number"
                                    value={formData.receipt_number}
                                    onChange={(e) => setFormData({ ...formData, receipt_number: e.target.value })}
                                    placeholder={formData.payment_method === 'cash' ? 'Optional' : 'Required'}
                                    required={formData.payment_method !== 'cash'}
                                />
                                {formData.payment_method === 'cash' && (
                                    <p className="text-xs text-gray-500">Optional for cash payments</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="payment_date">Payment Date *</Label>
                                <Input
                                    id="payment_date"
                                    type="date"
                                    required
                                    value={formData.payment_date}
                                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                                />
                            </div>
                        </div>

                        {formData.payment_method === 'other' && (
                            <div className="space-y-2">
                                <Label htmlFor="other_method">Please Specify Payment Method *</Label>
                                <Input
                                    id="other_method"
                                    value={formData.other_method}
                                    onChange={(e) => setFormData({ ...formData, other_method: e.target.value })}
                                    placeholder="e.g., Credit Card, Debit Card, etc."
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="receipt_file">Upload Receipt (PDF, JPG, PNG) *</Label>
                            <Input
                                id="receipt_file"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                required
                                onChange={handleFileChange}
                            />
                            <p className="text-xs text-gray-500">Max file size: 5MB</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Any additional information..."
                                rows={3}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Upload className="h-4 w-4 mr-2" />
                                )}
                                {isSubmitting ? "Processing..." : "Submit Receipt"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Payment Submission</DialogTitle>
                        <DialogDescription>
                            Please review your payment details before submitting.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                        <p className="text-sm"><strong>Request ID:</strong> #{selectedRequest?.id}</p>
                        <p className="text-sm"><strong>Applicant:</strong> {selectedRequest?.applicant_name}</p>
                        <p className="text-sm"><strong>Amount:</strong> ₱{parseFloat(formData.amount || 0).toLocaleString()}</p>
                        <p className="text-sm"><strong>Payment Method:</strong> {formData.payment_method === 'other' ? formData.other_method : formData.payment_method.replace('_', ' ')}</p>
                        <p className="text-sm"><strong>Payment Date:</strong> {formData.payment_date}</p>
                        {formData.receipt_number && (
                            <p className="text-sm"><strong>Receipt Number:</strong> {formData.receipt_number}</p>
                        )}
                        {formData.receipt_file && (
                            <p className="text-sm"><strong>File:</strong> {formData.receipt_file.name}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmSubmit} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {isSubmitting ? "Submitting..." : "Confirm & Submit"}
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

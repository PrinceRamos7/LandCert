import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { NotificationModal } from "@/Components/ui/notification-modal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
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
    Download,
    CheckSquare,
} from "lucide-react";
import { router } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";

export function AdminPaymentList({ payments }) {
    const paymentsData = payments?.data || [];
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [selectedPayments, setSelectedPayments] = useState([]);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
    const [isBulkVerifyDialogOpen, setIsBulkVerifyDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [notificationModal, setNotificationModal] = useState({
        isOpen: false,
        type: "success",
        title: "",
        message: "",
        buttonText: "Continue",
    });
    const { toast } = useToast();

    const getStatusColor = (status) => {
        switch (status) {
            case "verified":
                return "bg-emerald-100 text-emerald-800 border-emerald-300";
            case "rejected":
                return "bg-rose-100 text-rose-800 border-rose-300";
            default:
                return "bg-blue-100 text-blue-800 border-blue-300";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "verified":
                return <CheckCircle2 className="h-4 w-4" />;
            case "rejected":
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

        router.post(
            route("admin.payments.verify", selectedPayment.id),
            {},
            {
                onSuccess: () => {
                    setIsVerifyDialogOpen(false);
                    setSelectedPayment(null);
                    setNotificationModal({
                        isOpen: true,
                        type: "success",
                        title: "Payment Verified!",
                        message: `Payment for Request #${selectedPayment.request_id} has been verified successfully. The certificate has been generated and the applicant will be notified via email.`,
                        buttonText: "Continue",
                    });
                },
                onError: () => {
                    setIsVerifyDialogOpen(false);
                    setNotificationModal({
                        isOpen: true,
                        type: "error",
                        title: "Verification Failed!",
                        message:
                            "Failed to verify the payment. Please try again or contact support if the problem persists.",
                        buttonText: "Try Again",
                    });
                },
            }
        );
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
                message:
                    "Please provide a reason for rejecting this payment. This feedback will be sent to the applicant to help them understand what needs to be corrected.",
                buttonText: "OK",
            });
            return;
        }

        router.post(
            route("admin.payments.reject", selectedPayment.id),
            {
                rejection_reason: rejectionReason,
            },
            {
                onSuccess: () => {
                    setIsRejectDialogOpen(false);
                    setRejectionReason("");
                    setNotificationModal({
                        isOpen: true,
                        type: "success",
                        title: "Payment Rejected!",
                        message: `Payment for Request #${selectedPayment.request_id} has been rejected. The applicant has been notified via email with your feedback.`,
                        buttonText: "Continue",
                    });
                },
                onError: () => {
                    setIsRejectDialogOpen(false);
                    setNotificationModal({
                        isOpen: true,
                        type: "error",
                        title: "Rejection Failed!",
                        message:
                            "Failed to reject the payment. Please try again or contact support if the problem persists.",
                        buttonText: "Try Again",
                    });
                },
            }
        );
    };

    const handleView = (payment) => {
        setSelectedPayment(payment);
        setIsViewDialogOpen(true);
    };

    const filteredPayments = useMemo(() => {
        let filtered = paymentsData;

        if (filterStatus !== "all") {
            filtered = filtered.filter(
                (p) => p.payment_status === filterStatus
            );
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (p) =>
                    p.applicant_name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    p.receipt_number
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    p.id?.toString().includes(searchTerm)
            );
        }

        return filtered;
    }, [paymentsData, filterStatus, searchTerm]);

    const stats = useMemo(() => {
        return {
            total: paymentsData.length,
            pending: paymentsData.filter((p) => p.payment_status === "pending")
                .length,
            verified: paymentsData.filter(
                (p) => p.payment_status === "verified"
            ).length,
            rejected: paymentsData.filter(
                (p) => p.payment_status === "rejected"
            ).length,
        };
    }, [paymentsData]);

    const handleExport = () => {
        const url = route("admin.export.payments", {
            status: filterStatus,
            format: "pdf",
        });
        window.location.href = url;
        toast({
            title: "Export Started",
            description: "Your PDF file will download shortly.",
        });
    };

    const handleSelectPayment = (paymentId) => {
        setSelectedPayments((prev) =>
            prev.includes(paymentId)
                ? prev.filter((id) => id !== paymentId)
                : [...prev, paymentId]
        );
    };

    const handleSelectAll = () => {
        const pendingPayments = filteredPayments
            .filter((p) => p.payment_status === "pending")
            .map((p) => p.id);

        if (selectedPayments.length === pendingPayments.length) {
            setSelectedPayments([]);
        } else {
            setSelectedPayments(pendingPayments);
        }
    };

    const handleBulkVerify = () => {
        setIsBulkVerifyDialogOpen(true);
    };

    const confirmBulkVerify = () => {
        router.post(
            route("admin.bulk.approve"),
            { payment_ids: selectedPayments },
            {
                onSuccess: () => {
                    setIsBulkVerifyDialogOpen(false);
                    setSelectedPayments([]);
                    setNotificationModal({
                        isOpen: true,
                        type: "success",
                        title: "Bulk Verification Complete!",
                        message: `Successfully verified ${selectedPayments.length} payment(s). Certificates have been generated and applicants will be notified via email.`,
                        buttonText: "Continue",
                    });
                },
                onError: () => {
                    setIsBulkVerifyDialogOpen(false);
                    setNotificationModal({
                        isOpen: true,
                        type: "error",
                        title: "Bulk Verification Failed!",
                        message:
                            "Failed to verify some payments. Please try again or verify them individually.",
                        buttonText: "Try Again",
                    });
                },
            }
        );
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
                                        onClick={() =>
                                            handlePageChange(link.url)
                                        }
                                        className={
                                            !link.url
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>
                            );
                        }

                        if (index === payments.links.length - 1) {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationNext
                                        onClick={() =>
                                            handlePageChange(link.url)
                                        }
                                        className={
                                            !link.url
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>
                            );
                        }

                        if (link.label === "...") {
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
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-6 min-h-screen bg-gray-50 p-6">
            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card
                    className="cursor-pointer bg-purple-50 border-0"
                    onClick={() => setFilterStatus("all")}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-purple-700 font-medium mb-1">
                                    Total Payments
                                </p>
                                <p className="text-2xl font-bold text-purple-900">
                                    {stats.total}
                                </p>
                                <p className="text-xs text-purple-600 mt-0.5">
                                    All submissions
                                </p>
                            </div>
                            <div className="p-2 bg-purple-500 rounded-lg">
                                <DollarSign className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer bg-yellow-50 border-0"
                    onClick={() => setFilterStatus("pending")}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-yellow-700 font-medium mb-1">
                                    Pending
                                </p>
                                <p className="text-2xl font-bold text-yellow-900">
                                    {stats.pending}
                                </p>
                                <p className="text-xs text-yellow-600 mt-0.5">
                                    Awaiting verification
                                </p>
                            </div>
                            <div className="p-2 bg-yellow-500 rounded-lg">
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer bg-green-50 border-0"
                    onClick={() => setFilterStatus("verified")}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-green-700 font-medium mb-1">
                                    Verified
                                </p>
                                <p className="text-2xl font-bold text-green-900">
                                    {stats.verified}
                                </p>
                                <p className="text-xs text-green-600 mt-0.5">
                                    Successfully processed
                                </p>
                            </div>
                            <div className="p-2 bg-green-500 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer bg-red-50 border-0"
                    onClick={() => setFilterStatus("rejected")}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-red-700 font-medium mb-1">
                                    Rejected
                                </p>
                                <p className="text-2xl font-bold text-red-900">
                                    {stats.rejected}
                                </p>
                                <p className="text-xs text-red-600 mt-0.5">
                                    Needs attention
                                </p>
                            </div>
                            <div className="p-2 bg-red-500 rounded-lg">
                                <XCircle className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payments Table */}
            <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <CardHeader className="bg-blue-600 border-b border-blue-700 p-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3 text-xl font-bold text-white">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <FileText className="h-6 w-6 text-white" />
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
                                Export PDF
                            </Button>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                                <Input
                                    placeholder="Search payments..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                                />
                            </div>
                            {filterStatus !== "all" && (
                                <Button
                                    variant="outline"
                                    onClick={() => setFilterStatus("all")}
                                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                                >
                                    Clear Filter
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>

                {/* Bulk Actions Bar */}
                {selectedPayments.length > 0 && (
                    <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-semibold">
                                    {selectedPayments.length}
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                    {selectedPayments.length} item
                                    {selectedPayments.length > 1
                                        ? "s"
                                        : ""}{" "}
                                    selected
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedPayments([])}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 text-sm"
                                >
                                    Clear selection
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={handleBulkVerify}
                                    className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Approve
                                </Button>
                                <Button
                                    variant="outline"
                                    className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Reject
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleExport}
                                    className="gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Export
                                </Button>
                                <Button
                                    variant="outline"
                                    className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3 font-semibold w-12">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedPayments.length > 0 &&
                                                selectedPayments.length ===
                                                    filteredPayments.filter(
                                                        (p) =>
                                                            p.payment_status ===
                                                            "pending"
                                                    ).length
                                            }
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 rounded border-gray-300"
                                        />
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        ID
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        Applicant
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        Amount
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        Method
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        Date
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        Status
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-3">
                                            {payment.payment_status ===
                                                "pending" && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPayments.includes(
                                                        payment.id
                                                    )}
                                                    onChange={() =>
                                                        handleSelectPayment(
                                                            payment.id
                                                        )
                                                    }
                                                    className="w-4 h-4 rounded border-gray-300"
                                                />
                                            )}
                                        </td>
                                        <td className="p-3 font-mono text-sm">
                                            #{payment.id}
                                        </td>
                                        <td className="p-3">
                                            <div>
                                                <p className="font-medium">
                                                    {payment.applicant_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Request #
                                                    {payment.request_id}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-3 font-semibold">
                                            ₱
                                            {parseFloat(
                                                payment.amount
                                            ).toLocaleString()}
                                        </td>
                                        <td className="p-3 text-sm capitalize">
                                            {payment.payment_method.replace(
                                                "_",
                                                " "
                                            )}
                                        </td>
                                        <td className="p-3 text-sm">
                                            {formatDate(payment.payment_date)}
                                        </td>
                                        <td className="p-3">
                                            <Badge
                                                className={getStatusColor(
                                                    payment.payment_status
                                                )}
                                            >
                                                <span className="flex items-center gap-1">
                                                    {getStatusIcon(
                                                        payment.payment_status
                                                    )}
                                                    {payment.payment_status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        payment.payment_status.slice(
                                                            1
                                                        )}
                                                </span>
                                            </Badge>
                                        </td>
                                        <td className="p-3">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleView(payment)
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    {payment.payment_status ===
                                                        "pending" && (
                                                        <>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleVerifyClick(
                                                                        payment
                                                                    )
                                                                }
                                                                className="text-emerald-600"
                                                            >
                                                                <ThumbsUp className="h-4 w-4 mr-2" />
                                                                Verify Payment
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleRejectClick(
                                                                        payment
                                                                    )
                                                                }
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

            {/* Payment Details Modal - Clean Layout */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-[98vw] w-full max-h-[95vh] bg-white border border-blue-300 rounded-lg overflow-hidden">
                    <DialogHeader className="pb-3 bg-blue-600 text-white p-4 -m-6 mb-4 rounded-t-lg">
                        <DialogTitle className="text-lg font-bold text-white">
                            Payment Details #{selectedPayment?.id}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-white">
                            Submitted on{" "}
                            {formatDate(selectedPayment?.created_at)} • Status:{" "}
                            {selectedPayment?.payment_status
                                ?.charAt(0)
                                .toUpperCase() +
                                selectedPayment?.payment_status?.slice(1)}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Content Grid - 2 Column Layout */}
                    <div className="grid grid-cols-2 gap-6 overflow-y-auto max-h-[calc(90vh-120px)] px-1">
                        {/* Left Column */}
                        {selectedPayment && (
                            <div className="space-y-4">
                                {/* Applicant Information */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 ">
                                        <FileText className="h-4 w-4" />
                                        Applicant Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Applicant Name
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {selectedPayment.applicant_name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Email Address
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {selectedPayment.applicant_email ||
                                                    "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Request ID
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                #{selectedPayment.request_id}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Information */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" />
                                        Payment Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Amount Paid
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                ₱
                                                {parseFloat(
                                                    selectedPayment.amount
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Payment Method
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900 capitalize">
                                                {selectedPayment.payment_method.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </p>
                                        </div>
                                        {selectedPayment.receipt_number && (
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Receipt Number
                                                </p>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {
                                                        selectedPayment.receipt_number
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Payment Date
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {formatDate(
                                                    selectedPayment.payment_date
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Information */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Status Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Current Status
                                            </p>
                                            <Badge
                                                className={getStatusColor(
                                                    selectedPayment.payment_status
                                                )}
                                            >
                                                <span className="flex items-center gap-1">
                                                    {getStatusIcon(
                                                        selectedPayment.payment_status
                                                    )}
                                                    {selectedPayment.payment_status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        selectedPayment.payment_status.slice(
                                                            1
                                                        )}
                                                </span>
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Submission Date
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {formatDate(
                                                    selectedPayment.created_at
                                                )}
                                            </p>
                                        </div>
                                        {selectedPayment.verified_by_name && (
                                            <>
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Verified By
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {
                                                            selectedPayment.verified_by_name
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Verified On
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {formatDate(
                                                            selectedPayment.verified_at
                                                        )}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Right Column */}
                        {selectedPayment && (
                            <div className="space-y-4">
                                {/* Receipt Document */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Receipt Document
                                    </h3>
                                    {selectedPayment.receipt_file_path ? (
                                        <div className="space-y-3">
                                            {(selectedPayment.receipt_file_path
                                                .toLowerCase()
                                                .endsWith(".png") ||
                                                selectedPayment.receipt_file_path
                                                    .toLowerCase()
                                                    .endsWith(".jpg") ||
                                                selectedPayment.receipt_file_path
                                                    .toLowerCase()
                                                    .endsWith(".jpeg")) && (
                                                <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                                                    <img
                                                        src={`/storage/${selectedPayment.receipt_file_path}`}
                                                        alt="Payment Receipt"
                                                        className="w-full h-auto object-contain"
                                                        style={{
                                                            maxHeight: "400px",
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <a
                                                href={`/storage/${selectedPayment.receipt_file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View Full Document
                                            </a>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            No receipt uploaded
                                        </p>
                                    )}
                                </div>

                                {/* Additional Information */}
                                {(selectedPayment.notes ||
                                    selectedPayment.rejection_reason) && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Additional Information
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedPayment.notes && (
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Notes
                                                    </p>
                                                    <p className="text-sm text-gray-900">
                                                        {selectedPayment.notes}
                                                    </p>
                                                </div>
                                            )}
                                            {selectedPayment.rejection_reason && (
                                                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                                                    <p className="text-xs text-rose-700 font-semibold mb-1">
                                                        Rejection Reason
                                                    </p>
                                                    <p className="text-sm text-rose-900">
                                                        {
                                                            selectedPayment.rejection_reason
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Verify Confirmation Dialog */}
            <Dialog
                open={isVerifyDialogOpen}
                onOpenChange={setIsVerifyDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Verify Payment</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to verify this payment? This
                            will automatically generate and send the certificate
                            to the applicant.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPayment && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                            <p className="text-sm">
                                <strong>Payment ID:</strong> #
                                {selectedPayment.id}
                            </p>
                            <p className="text-sm">
                                <strong>Applicant:</strong>{" "}
                                {selectedPayment.applicant_name}
                            </p>
                            <p className="text-sm">
                                <strong>Amount:</strong> ₱
                                {parseFloat(
                                    selectedPayment.amount
                                ).toLocaleString()}
                            </p>
                            <p className="text-sm">
                                <strong>Method:</strong>{" "}
                                {selectedPayment.payment_method.replace(
                                    "_",
                                    " "
                                )}
                            </p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsVerifyDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={confirmVerify}
                        >
                            Verify & Generate Certificate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog
                open={isRejectDialogOpen}
                onOpenChange={setIsRejectDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Payment</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this payment.
                            The applicant will be able to resubmit.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="rejection_reason">
                                Rejection Reason *
                            </Label>
                            <Textarea
                                id="rejection_reason"
                                value={rejectionReason}
                                onChange={(e) =>
                                    setRejectionReason(e.target.value)
                                }
                                placeholder="Enter reason for rejection..."
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsRejectDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRejectSubmit}
                        >
                            Reject Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Verify Dialog */}
            <Dialog
                open={isBulkVerifyDialogOpen}
                onOpenChange={setIsBulkVerifyDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Bulk Verify Payments</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to verify{" "}
                            {selectedPayments.length} payment(s)? This will
                            automatically generate and send certificates to all
                            selected applicants.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <p className="text-sm font-semibold mb-2">
                            {selectedPayments.length} payment(s) will be
                            verified
                        </p>
                        <p className="text-xs text-gray-600">
                            Certificates will be generated and email
                            notifications will be sent to all applicants.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsBulkVerifyDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={confirmBulkVerify}
                        >
                            Verify All & Generate Certificates
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Notification Modal */}
            <NotificationModal
                isOpen={notificationModal.isOpen}
                onClose={() =>
                    setNotificationModal((prev) => ({ ...prev, isOpen: false }))
                }
                type={notificationModal.type}
                title={notificationModal.title}
                message={notificationModal.message}
                buttonText={notificationModal.buttonText}
            />
        </div>
    );
}

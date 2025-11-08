import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { NotificationModal } from "@/Components/ui/notification-modal";
import BulkActions from "@/Components/ui/bulk-actions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    Download,
    Home,
} from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useForm, router } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";

export function AdminRequestList({ requests, flash = {} }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
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
    const {
        data: editData,
        setData: setEditData,
        post: postEdit,
        processing: editProcessing,
    } = useForm({
        evaluation: "",
        description: "",
        amount: "",
        date_certified: "",
        issued_by: "",
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

        router.post(
            route("admin.update-evaluation", request.report_id),
            {
                evaluation: action,
                issued_by: "Admin",
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: "Success!",
                        description: `Request ${action} successfully!`,
                    });
                },
                onError: (errors) => {
                    console.error("Update error:", errors);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to update request status.",
                    });
                },
            }
        );
    };

    const handleExport = () => {
        const url = route("admin.export.requests", { status: filterStatus, format: 'pdf' });
        window.location.href = url;
        toast({
            title: "Export Started",
            description: "Your PDF file will download shortly.",
        });
    };

    const handleEdit = (request) => {
        setSelectedRequest(request);
        setEditData({
            evaluation: request.evaluation || request.status || "pending",
            description: request.project_nature || "",
            amount: request.project_cost || "",
            date_certified: "",
            issued_by: "",
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

        router.post(
            route("admin.update-evaluation", selectedRequest.report_id),
            editData,
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: "Success!",
                        description: "Request updated successfully!",
                    });
                    setIsEditModalOpen(false);
                },
                onError: (errors) => {
                    console.error("Update error:", errors);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to update request.",
                    });
                },
            }
        );
    };

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState(null);
    const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
    const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
    const [requestToAction, setRequestToAction] = useState(null);
    const [rejectionFeedback, setRejectionFeedback] = useState("");
    const [notificationModal, setNotificationModal] = useState({
        isOpen: false,
        type: "success",
        title: "",
        message: "",
        buttonText: "Continue",
    });

    const handleDeleteClick = (request) => {
        setRequestToDelete(request);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!requestToDelete) return;

        router.delete(route("admin.delete-request", requestToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setRequestToDelete(null);
                setNotificationModal({
                    isOpen: true,
                    type: "success",
                    title: "Request Deleted!",
                    message: `Request #${requestToDelete.id} has been permanently deleted from the system.`,
                    buttonText: "Continue",
                });
            },
            onError: (errors) => {
                console.error("Delete error:", errors);
                setIsDeleteDialogOpen(false);
                setNotificationModal({
                    isOpen: true,
                    type: "error",
                    title: "Delete Failed!",
                    message:
                        "Failed to delete the request. Please try again or contact support if the problem persists.",
                    buttonText: "Try Again",
                });
            },
        });
    };

    const handleAcceptClick = (request) => {
        if (!request.report_id) {
            setNotificationModal({
                isOpen: true,
                type: "error",
                title: "Error",
                message:
                    "No report found for this request. Please contact support if this issue persists.",
                buttonText: "OK",
            });
            return;
        }
        setRequestToAction(request);
        setIsAcceptDialogOpen(true);
    };

    const confirmAccept = () => {
        if (!requestToAction) return;

        router.post(
            route("admin.update-evaluation", requestToAction.report_id),
            {
                evaluation: "approved",
                issued_by: "Admin",
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAcceptDialogOpen(false);
                    setRequestToAction(null);
                    setNotificationModal({
                        isOpen: true,
                        type: "success",
                        title: "Request Approved!",
                        message: `Request #${requestToAction.id} from ${requestToAction.applicant_name} has been approved successfully. The applicant will be notified via email.`,
                        buttonText: "Continue",
                    });
                },
                onError: (errors) => {
                    setIsAcceptDialogOpen(false);
                    setNotificationModal({
                        isOpen: true,
                        type: "error",
                        title: "Approval Failed!",
                        message:
                            "Failed to approve the request. Please try again or contact support if the problem persists.",
                        buttonText: "Try Again",
                    });
                },
            }
        );
    };

    const handleDeclineClick = (request) => {
        if (!request.report_id) {
            setNotificationModal({
                isOpen: true,
                type: "error",
                title: "Error",
                message:
                    "No report found for this request. Please contact support if this issue persists.",
                buttonText: "OK",
            });
            return;
        }
        setRequestToAction(request);
        setRejectionFeedback(""); // Reset feedback
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
                message:
                    "Please provide feedback explaining why this request is being rejected. This feedback will be sent to the applicant to help them understand what needs to be corrected.",
                buttonText: "OK",
            });
            return;
        }

        router.post(
            route("admin.update-evaluation", requestToAction.report_id),
            {
                evaluation: "rejected",
                description: rejectionFeedback.trim(),
                issued_by: "Admin",
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeclineDialogOpen(false);
                    setRequestToAction(null);
                    setRejectionFeedback("");
                    setNotificationModal({
                        isOpen: true,
                        type: "success",
                        title: "Request Declined!",
                        message: `Request #${requestToAction.id} from ${requestToAction.applicant_name} has been declined. The applicant has been notified via email with your feedback.`,
                        buttonText: "Continue",
                    });
                },
                onError: (errors) => {
                    setIsDeclineDialogOpen(false);
                    setNotificationModal({
                        isOpen: true,
                        type: "error",
                        title: "Decline Failed!",
                        message:
                            "Failed to decline the request. Please try again or contact support if the problem persists.",
                        buttonText: "Try Again",
                    });
                },
            }
        );
    };

    // Bulk Actions Handlers
    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedItems(filteredRequests.map((request) => request.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (requestId, checked) => {
        if (checked) {
            setSelectedItems((prev) => [...prev, requestId]);
        } else {
            setSelectedItems((prev) => prev.filter((id) => id !== requestId));
        }
    };

    const handleClearSelection = () => {
        setSelectedItems([]);
    };

    const handleBulkApprove = async (selectedIds) => {
        setBulkLoading(true);

        try {
            await new Promise((resolve, reject) => {
                router.post(
                    route("admin.bulk.approve"),
                    {
                        request_ids: selectedIds,
                    },
                    {
                        preserveScroll: true,
                        onSuccess: () => resolve(),
                        onError: (errors) =>
                            reject(new Error("Failed to approve requests")),
                    }
                );
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
                router.post(
                    route("admin.bulk.reject"),
                    {
                        request_ids: selectedIds,
                        reason: reason,
                    },
                    {
                        preserveScroll: true,
                        onSuccess: () => resolve(),
                        onError: (errors) =>
                            reject(new Error("Failed to reject requests")),
                    }
                );
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
                router.delete(route("admin.bulk.delete"), {
                    data: { request_ids: selectedIds },
                    preserveScroll: true,
                    onSuccess: () => resolve(),
                    onError: (errors) =>
                        reject(new Error("Failed to delete requests")),
                });
            });
        } catch (error) {
            throw error;
        } finally {
            setBulkLoading(false);
        }
    };

    const handleBulkExport = (selectedIds) => {
        const selectedRequests = filteredRequests.filter((req) =>
            selectedIds.includes(req.id)
        );
        const csvContent = generateCSV(selectedRequests);
        downloadCSV(
            csvContent,
            `selected-requests-${new Date().toISOString().split("T")[0]}.csv`
        );
    };

    const generateCSV = (requests) => {
        const headers = [
            "ID",
            "Applicant Name",
            "User Email",
            "Project Type",
            "Status",
            "Created Date",
        ];
        const rows = requests.map((req) => [
            req.id,
            req.applicant_name || "",
            req.user_email || "",
            req.project_type || "",
            req.status || "pending",
            formatDate(req.created_at),
        ]);

        return [headers, ...rows]
            .map((row) => row.map((field) => `"${field}"`).join(","))
            .join("\n");
    };

    const downloadCSV = (content, filename) => {
        const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-300";
            case "rejected":
                return "bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-300";
            default:
                return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "approved":
                return <CheckCircle2 className="h-4 w-4" />;
            case "rejected":
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatLocation = (request) => {
        const parts = [
            request?.project_location_street,
            request?.project_location_barangay,
            request?.project_location_city ||
                request?.project_location_municipality,
            request?.project_location_province,
        ].filter(Boolean);
        return parts.join(", ") || "Location not specified";
    };

    const filteredRequests = useMemo(() => {
        let filtered = requestsData;

        // Filter by status
        if (filterStatus !== "all") {
            filtered = filtered.filter((r) => r.status === filterStatus);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (r) =>
                    r.applicant_name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    r.user_email
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    r.project_type
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    r.id?.toString().includes(searchTerm)
            );
        }

        return filtered;
    }, [requestsData, filterStatus, searchTerm]);

    const stats = useMemo(() => {
        return {
            total: requestsData.length,
            pending: requestsData.filter((r) => r.status === "pending").length,
            approved: requestsData.filter((r) => r.status === "approved")
                .length,
            rejected: requestsData.filter((r) => r.status === "rejected")
                .length,
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

                        if (index === requests.links.length - 1) {
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

    return (
        <div className="space-y-6 min-h-screen bg-white p-6">
            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card
                    className="cursor-pointer bg-purple-50 border-0"
                    onClick={() => setFilterStatus("all")}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-purple-700 font-medium mb-1">Total Requests</p>
                                <p className="text-2xl font-bold text-purple-900">{stats.total}</p>
                                <p className="text-xs text-purple-600 mt-0.5">All submissions</p>
                            </div>
                            <div className="p-2 bg-purple-500 rounded-lg">
                                <FileText className="h-5 w-5 text-white" />
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
                                <p className="text-xs text-yellow-700 font-medium mb-1">Pending</p>
                                <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
                                <p className="text-xs text-yellow-600 mt-0.5">Awaiting review</p>
                            </div>
                            <div className="p-2 bg-yellow-500 rounded-lg">
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer bg-green-50 border-0"
                    onClick={() => setFilterStatus("approved")}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-green-700 font-medium mb-1">Approved</p>
                                <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
                                <p className="text-xs text-green-600 mt-0.5">Successfully processed</p>
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
                                <p className="text-xs text-red-700 font-medium mb-1">Rejected</p>
                                <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
                                <p className="text-xs text-red-600 mt-0.5">Needs attention</p>
                            </div>
                            <div className="p-2 bg-red-500 rounded-lg">
                                <XCircle className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Requests Table */}
            <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                <CardHeader className="bg-blue-600 border-b border-blue-700 p-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3 text-xl font-bold text-white">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <FileText className="h-6 w-6 text-white" />
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
                                Export PDF
                            </Button>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                                <Input
                                    placeholder="Search requests..."
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
                <CardContent>
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
                                <tr className="border-b">
                                    <th className="text-left p-3 font-semibold w-12">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedItems.length ===
                                                    filteredRequests.length &&
                                                filteredRequests.length > 0
                                            }
                                            onChange={(e) =>
                                                handleSelectAll(
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        ID
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        Applicant
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        User
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        Project Type
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        Location
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
                                {filteredRequests.map((request, index) => (
                                    <tr
                                        key={request.id}
                                        className={`border-b hover:bg-gray-50 ${
                                            selectedItems.includes(request.id)
                                                ? "bg-blue-50"
                                                : ""
                                        }`}
                                    >
                                        <td className="p-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(
                                                    request.id
                                                )}
                                                onChange={(e) =>
                                                    handleSelectItem(
                                                        request.id,
                                                        e.target.checked
                                                    )
                                                }
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="p-3 font-mono text-sm">
                                            #{request.id}
                                        </td>
                                        <td className="p-3">
                                            <div>
                                                <p className="font-medium">
                                                    {request.applicant_name}
                                                </p>
                                                {request.corporation_name && (
                                                    <p className="text-xs text-gray-500">
                                                        {
                                                            request.corporation_name
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {request.user_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {request.user_email}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm">
                                            {request.project_type || "N/A"}
                                        </td>
                                        <td className="p-3 text-sm max-w-xs truncate">
                                            {formatLocation(request)}
                                        </td>
                                        <td className="p-3 text-sm">
                                            {formatDate(request.created_at)}
                                        </td>
                                        <td className="p-3">
                                            <Badge
                                                className={getStatusColor(
                                                    request.status
                                                )}
                                            >
                                                <span className="flex items-center gap-1">
                                                    {getStatusIcon(
                                                        request.status
                                                    )}
                                                    {(
                                                        request.status ||
                                                        "pending"
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        (
                                                            request.status ||
                                                            "pending"
                                                        ).slice(1)}
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
                                                        onClick={() => {
                                                            setSelectedRequest(
                                                                request
                                                            );
                                                            setIsModalOpen(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleEdit(request)
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleAcceptClick(
                                                                request
                                                            )
                                                        }
                                                        disabled={
                                                            request.status ===
                                                            "approved"
                                                        }
                                                        className="text-emerald-600"
                                                    >
                                                        <ThumbsUp className="h-4 w-4 mr-2" />
                                                        Accept
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDeclineClick(
                                                                request
                                                            )
                                                        }
                                                        disabled={
                                                            request.status ===
                                                            "rejected"
                                                        }
                                                        className="text-rose-600"
                                                    >
                                                        <ThumbsDown className="h-4 w-4 mr-2" />
                                                        Decline
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                request
                                                            )
                                                        }
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

            {/* Request Details Modal - Complete View */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-[95vw] w-full max-h-[95vh] bg-white border border-blue-300 rounded-lg overflow-hidden">
                    <DialogHeader className="pb-3 bg-blue-600 text-white p-4 -m-6 mb-4 rounded-t-lg">
                        <DialogTitle className="text-lg font-bold text-white">
                            Request Details #{selectedRequest?.id}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-white">
                            Submitted on {formatDate(selectedRequest?.created_at)} • Status: {(selectedRequest?.status || "pending").charAt(0).toUpperCase() + (selectedRequest?.status || "pending").slice(1)}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Content Grid - 2 Column Layout */}
                    <div className="grid grid-cols-2 gap-6 overflow-y-auto max-h-[calc(90vh-120px)] px-1">
                        {/* Left Column */}
                        {selectedRequest && (
                            <div className="space-y-4">
                                {/* Applicant Information */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Applicant Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Name of Applicant</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedRequest.applicant_name || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Address of Applicant</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedRequest.applicant_address || "N/A"}</p>
                                        </div>
                                        {selectedRequest.corporation_name && (
                                            <>
                                                <div>
                                                    <p className="text-xs text-gray-500">Name of Corporation</p>
                                                    <p className="text-sm font-semibold text-gray-900">{selectedRequest.corporation_name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Address of Corporation</p>
                                                    <p className="text-sm font-semibold text-gray-900">{selectedRequest.corporation_address}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Authorized Representative */}
                                {selectedRequest.authorized_representative_name && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Authorized Representative
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-500">Name of Authorized Representative</p>
                                                <p className="text-sm font-semibold text-gray-900">{selectedRequest.authorized_representative_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Address of Authorized Representative</p>
                                                <p className="text-sm font-semibold text-gray-900">{selectedRequest.authorized_representative_address || "N/A"}</p>
                                            </div>
                                            {selectedRequest.authorization_letter_path && (
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-2">Authorization Letter</p>
                                                    <a
                                                        href={`/storage/${selectedRequest.authorization_letter_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        <FileText className="h-3 w-3" />
                                                        View Document
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Project Details */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        Project Details
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Project Type</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedRequest.project_type || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Project Nature</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedRequest.project_nature || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Location */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Project Location
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">House/Building Number</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedRequest.project_location_number || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Street</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedRequest.project_location_street || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Barangay</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedRequest.project_location_barangay || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Municipality</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedRequest.project_location_municipality || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Province</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedRequest.project_location_province || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Right Column */}
                        {selectedRequest && (
                            <div className="space-y-4">
                                {/* Project Area Details */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        Project Area
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Project Area (sqm)</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedRequest.project_area_sqm ? parseFloat(selectedRequest.project_area_sqm).toLocaleString() : "N/A"} sqm</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Lot (sqm)</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedRequest.lot_area_sqm ? parseFloat(selectedRequest.lot_area_sqm).toLocaleString() : "N/A"} sqm</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Bldg. Improvement (sqm)</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedRequest.bldg_improvement_sqm ? parseFloat(selectedRequest.bldg_improvement_sqm).toLocaleString() : "N/A"} sqm</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Right Over Land</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedRequest.right_over_land || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Nature & Cost */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" />
                                        Project Nature & Cost
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Project Nature</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedRequest.project_nature_duration || "N/A"}</p>
                                        </div>
                                        {selectedRequest.project_nature_duration === "Temporary" && selectedRequest.project_nature_years && (
                                            <div>
                                                <p className="text-xs text-gray-500">Specify Years</p>
                                                <p className="text-sm font-semibold text-gray-900">{selectedRequest.project_nature_years} years</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xs text-gray-500">Project Cost/Capitalization (in Pesos)</p>
                                            <p className="text-sm font-semibold text-gray-900">₱{selectedRequest.project_cost ? parseFloat(selectedRequest.project_cost).toLocaleString() : "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Land Use Information */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Home className="h-4 w-4" />
                                        Land Use Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Existing Land Uses of Project Use</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedRequest.existing_land_use || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Written Notice from Office/Zoning Administrator</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedRequest.has_written_notice ? selectedRequest.has_written_notice.toUpperCase() : "N/A"}</p>
                                        </div>
                                        {selectedRequest.has_written_notice === "yes" && (
                                            <>
                                                <div>
                                                    <p className="text-xs text-gray-500">Name of HSRC Officer/Zoning Administrator</p>
                                                    <p className="text-sm font-semibold text-gray-900">{selectedRequest.notice_officer_name || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Date(s) of Notice(s)</p>
                                                    <p className="text-sm font-semibold text-gray-900">{selectedRequest.notice_dates || "N/A"}</p>
                                                </div>
                                            </>
                                        )}
                                        <div>
                                            <p className="text-xs text-gray-500">Similar Application with Other Offices</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedRequest.has_similar_application ? selectedRequest.has_similar_application.toUpperCase() : "N/A"}</p>
                                        </div>
                                        {selectedRequest.has_similar_application === "yes" && (
                                            <>
                                                <div>
                                                    <p className="text-xs text-gray-500">Other HSRC Office(s) Where Filed</p>
                                                    <p className="text-sm font-semibold text-gray-900">{selectedRequest.similar_application_offices || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Date(s) Filed</p>
                                                    <p className="text-sm font-semibold text-gray-900">{selectedRequest.similar_application_dates || "N/A"}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Release Preference */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Release Preference
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Preferred Mode of Release of Decision</p>
                                            <p className="text-sm font-semibold text-gray-900 capitalize">
                                                {selectedRequest.preferred_release_mode ? selectedRequest.preferred_release_mode.replace(/_/g, " ") : "N/A"}
                                            </p>
                                        </div>
                                        {selectedRequest.release_address && (
                                            <div>
                                                <p className="text-xs text-gray-500">Release Address</p>
                                                <p className="text-sm font-semibold text-gray-900">{selectedRequest.release_address}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Modal - Minimal Design */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl bg-white border border-gray-200 rounded-lg">
                    {/* Modal Header with Gradient Background */}
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 -m-6 mb-6 rounded-t-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <Edit className="h-6 w-6" />
                                </div>
                                Edit Request #{selectedRequest?.id}
                            </DialogTitle>
                            <DialogDescription className="text-blue-100 text-lg">
                                Update the evaluation status and report details for this request
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {/* Scrollable Form Content */}
                    <div className="overflow-y-auto max-h-[calc(85vh-200px)] pr-2">
                        <form onSubmit={handleEditSubmit} className="space-y-6">
                            {/* Evaluation Status */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                    Evaluation Status
                                </label>
                                <select
                                    value={editData.evaluation}
                                    onChange={(e) =>
                                        setEditData(
                                            "evaluation",
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                >
                                    <option value="pending">Pending Review</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    Description / Notes
                                </label>
                                <textarea
                                    value={editData.description}
                                    onChange={(e) =>
                                        setEditData(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                                    rows="4"
                                    placeholder="Enter detailed description or notes about this request..."
                                />
                            </div>

                            {/* Amount and Date Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Amount */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-blue-600" />
                                        Amount (₱)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                                            ₱
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editData.amount}
                                            onChange={(e) =>
                                                setEditData(
                                                    "amount",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Date Certified */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-blue-600" />
                                        Date Certified
                                    </label>
                                    <input
                                        type="date"
                                        value={editData.date_certified}
                                        onChange={(e) =>
                                            setEditData(
                                                "date_certified",
                                                e.target.value
                                            )
                                        }
                                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Issued By */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <User className="h-4 w-4 text-blue-600" />
                                    Issued By (Official Name)
                                </label>
                                <input
                                    type="text"
                                    value={editData.issued_by}
                                    onChange={(e) =>
                                        setEditData("issued_by", e.target.value)
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    placeholder="Enter the name of the issuing official"
                                />
                            </div>
                        </form>
                    </div>

                    {/* Footer with Action Buttons */}
                    <DialogFooter className="border-t pt-4 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={editProcessing}
                            onClick={handleEditSubmit}
                            className="px-6 bg-blue-600 hover:bg-blue-700"
                        >
                            {editProcessing ? (
                                <span className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Updating...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Update Request
                                </span>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Request</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete Request #
                            {requestToDelete?.id}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Accept Confirmation Dialog */}
            <Dialog
                open={isAcceptDialogOpen}
                onOpenChange={setIsAcceptDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Request</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to approve Request #
                            {requestToAction?.id}? The applicant will be
                            notified via email.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsAcceptDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={confirmAccept}
                        >
                            Approve
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Decline Confirmation Dialog */}
            <Dialog
                open={isDeclineDialogOpen}
                onOpenChange={setIsDeclineDialogOpen}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-rose-700">
                            Decline Request
                        </DialogTitle>
                        <DialogDescription>
                            You are about to decline Request #
                            {requestToAction?.id} from{" "}
                            {requestToAction?.applicant_name}. Please provide
                            detailed feedback explaining why this request is
                            being rejected. This feedback will be sent to the
                            applicant via email.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div>
                            <label
                                htmlFor="rejection-feedback"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Rejection Feedback{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="rejection-feedback"
                                value={rejectionFeedback}
                                onChange={(e) =>
                                    setRejectionFeedback(e.target.value)
                                }
                                placeholder="Please explain why this request is being rejected. Include specific issues that need to be addressed and any requirements that were not met..."
                                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-vertical"
                                maxLength={1000}
                            />
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-xs text-gray-500">
                                    This feedback will be included in the
                                    rejection email sent to the applicant.
                                </p>
                                <p className="text-xs text-gray-400">
                                    {rejectionFeedback.length}/1000
                                </p>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <div className="text-amber-600 mt-0.5">
                                    <svg
                                        className="w-4 h-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-amber-800">
                                        Important
                                    </p>
                                    <p className="text-xs text-amber-700">
                                        The applicant will receive an email with
                                        your feedback. Please be clear and
                                        constructive in your explanation.
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
                                setRejectionFeedback("");
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

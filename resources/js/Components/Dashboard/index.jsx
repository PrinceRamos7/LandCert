import React, { useState, useMemo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { ProgressIndicator } from "@/Components/ui/progress-indicator";
import {
    CalendarDays,
    MapPin,
    User,
    Building2,
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    Filter,
    DollarSign,
    Home,
    Briefcase,
    Plus,
    Download,
    Eye,
    Award,
    TrendingUp,
    Activity,
    Search,
    Mail,
} from "lucide-react";

export function Dashboard({ requests }) {
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showStatistics, setShowStatistics] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const requestsData = requests?.data || requests || [];

    // Calculate enhanced statistics
    const stats = useMemo(() => {
        const total = requestsData.length;
        const pending = requestsData.filter(
            (r) => r.status === "pending"
        ).length;
        const approved = requestsData.filter(
            (r) => r.status === "approved"
        ).length;
        const rejected = requestsData.filter(
            (r) => r.status === "rejected"
        ).length;
        const withCertificates = requestsData.filter(
            (r) => r.payment_verified && r.certificate_number
        ).length;
        const recentRequests = requestsData.filter((r) => {
            const requestDate = new Date(r.created_at);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return requestDate >= thirtyDaysAgo;
        }).length;

        return {
            total,
            pending,
            approved,
            rejected,
            withCertificates,
            recentRequests,
        };
    }, [requestsData]);

    // Filter requests based on selected status and search term
    const filteredRequests = useMemo(() => {
        let filtered = requestsData;
        
        // Filter by status
        if (filterStatus !== "all") {
            filtered = filtered.filter((r) => r.status === filterStatus);
        }
        
        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter((r) =>
                r.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.project_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.project_location_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.id?.toString().includes(searchTerm)
            );
        }
        
        return filtered;
    }, [requestsData, filterStatus, searchTerm]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [filterStatus, searchTerm]);

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

    const formatDate = (dateString) => {
        if (!dateString) return "Date not available";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (requests.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                {/* Welcome Section */}
                <div className="text-center mb-12">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full blur-3xl opacity-20"></div>
                        <div className="relative rounded-full bg-gradient-to-br from-blue-50 to-emerald-50 p-12 shadow-2xl border border-blue-100">
                            <Building2 className="h-20 w-20 text-blue-600 mx-auto" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to CPDO System
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">
                        Your Land Certification Dashboard
                    </p>
                    <p className="text-base text-gray-500 max-w-2xl mx-auto mb-8">
                        Submit and track your land certification requests with
                        ease. Get started by creating your first application
                        below.
                    </p>
                </div>

                {/* Quick Start Actions */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl mb-12">
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-dashed border-blue-200 hover:border-blue-400">
                        <CardContent className="p-6 text-center">
                            <div className="rounded-full bg-blue-100 p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                                <Plus className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                New Application
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Start your land certification process
                            </p>
                            <Button
                                asChild
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                            >
                                <a href="/request">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Submit Request
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-6 text-center">
                            <div className="rounded-full bg-emerald-100 p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                                <Eye className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Track Progress
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Monitor your application status
                            </p>
                            <Button
                                variant="outline"
                                className="w-full"
                                disabled
                            >
                                <Activity className="h-4 w-4 mr-2" />
                                No Requests Yet
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-6 text-center">
                            <div className="rounded-full bg-purple-100 p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                                <Award className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Get Certificate
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Download your certificates
                            </p>
                            <Button
                                variant="outline"
                                className="w-full"
                                disabled
                            >
                                <Download className="h-4 w-4 mr-2" />
                                No Certificates
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Process Steps */}
                <div className="w-full max-w-4xl">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                        How It Works
                    </h2>
                    <div className="grid gap-6 md:grid-cols-4">
                        {[
                            {
                                step: 1,
                                title: "Submit",
                                desc: "Fill out your application",
                                icon: FileText,
                                color: "blue",
                            },
                            {
                                step: 2,
                                title: "Review",
                                desc: "We process your request",
                                icon: Clock,
                                color: "amber",
                            },
                            {
                                step: 3,
                                title: "Payment",
                                desc: "Complete the payment",
                                icon: DollarSign,
                                color: "emerald",
                            },
                            {
                                step: 4,
                                title: "Certificate",
                                desc: "Download your certificate",
                                icon: Award,
                                color: "purple",
                            },
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div
                                    className={`rounded-full bg-${item.color}-100 p-4 w-16 h-16 mx-auto mb-4`}
                                >
                                    <item.icon
                                        className={`h-8 w-8 text-${item.color}-600`}
                                    />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    {item.step}. {item.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 overflow-x-hidden">
            {/* Header Section with Icon and Toggle Button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <FileText className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                            My Applications
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Track and manage your land certification requests
                        </p>
                    </div>
                </div>

                {/* Toggle Statistics Button */}
                <div>
                    <Button
                        onClick={() => setShowStatistics(!showStatistics)}
                        variant="outline"
                        className="gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        {showStatistics ? (
                            <>
                                <Eye className="h-4 w-4" />
                                Hide Statistics
                            </>
                        ) : (
                            <>
                                <Activity className="h-4 w-4" />
                                Show Statistics
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Statistics Cards or CDRRMO Logo */}
            {showStatistics ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 w-full">
                    <Card
                        className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200"
                        onClick={() => setFilterStatus("all")}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-700 mb-1">
                                        Total
                                    </p>
                                    <p className="text-3xl font-bold text-blue-900">
                                        {stats.total}
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        All requests
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-200 rounded-full group-hover:bg-blue-300 transition-colors">
                                    <FileText className="h-6 w-6 text-blue-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-0 bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200"
                        onClick={() => setFilterStatus("pending")}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-amber-700 mb-1">
                                        Pending
                                    </p>
                                    <p className="text-3xl font-bold text-amber-900">
                                        {stats.pending}
                                    </p>
                                    <p className="text-xs text-amber-600 mt-1">
                                        Under review
                                    </p>
                                </div>
                                <div className="p-3 bg-amber-200 rounded-full group-hover:bg-amber-300 transition-colors">
                                    <Clock className="h-6 w-6 text-amber-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200"
                        onClick={() => setFilterStatus("approved")}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-emerald-700 mb-1">
                                        Approved
                                    </p>
                                    <p className="text-3xl font-bold text-emerald-900">
                                        {stats.approved}
                                    </p>
                                    <p className="text-xs text-emerald-600 mt-1">
                                        Completed
                                    </p>
                                </div>
                                <div className="p-3 bg-emerald-200 rounded-full group-hover:bg-emerald-300 transition-colors">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-0 bg-gradient-to-br from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200"
                        onClick={() => setFilterStatus("rejected")}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-rose-700 mb-1">
                                        Rejected
                                    </p>
                                    <p className="text-3xl font-bold text-rose-900">
                                        {stats.rejected}
                                    </p>
                                    <p className="text-xs text-rose-600 mt-1">
                                        Need action
                                    </p>
                                </div>
                                <div className="p-3 bg-rose-200 rounded-full group-hover:bg-rose-300 transition-colors">
                                    <XCircle className="h-6 w-6 text-rose-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-700 mb-1">
                                        Certificates
                                    </p>
                                    <p className="text-3xl font-bold text-purple-900">
                                        {stats.withCertificates}
                                    </p>
                                    <p className="text-xs text-purple-600 mt-1">
                                        Ready
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-200 rounded-full group-hover:bg-purple-300 transition-colors">
                                    <Award className="h-6 w-6 text-purple-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-0 bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-indigo-700 mb-1">
                                        Recent
                                    </p>
                                    <p className="text-3xl font-bold text-indigo-900">
                                        {stats.recentRequests}
                                    </p>
                                    <p className="text-xs text-indigo-600 mt-1">
                                        Last 30 days
                                    </p>
                                </div>
                                <div className="p-3 bg-indigo-200 rounded-full group-hover:bg-indigo-300 transition-colors">
                                    <TrendingUp className="h-6 w-6 text-indigo-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="mb-8">
                    <Card className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 backdrop-blur-sm border-0 shadow-2xl rounded-3xl animate-in fade-in zoom-in duration-700">
                        <CardContent className="p-12">
                            <div className="flex flex-col items-center justify-center min-h-[450px] space-y-8">
                                <div className="relative group">
                                    {/* Animated background rings */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 opacity-20 animate-pulse"></div>
                                    <div className="absolute inset-2 rounded-full bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 opacity-30 animate-pulse delay-75"></div>
                                    <div className="absolute inset-4 rounded-full bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-600 opacity-40 animate-pulse delay-150"></div>

                                    {/* Logo container */}
                                    <div className="relative w-80 h-80 mx-auto group-hover:scale-110 transition-transform duration-700 ease-out">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 rounded-full shadow-2xl backdrop-blur-sm"></div>
                                        <div className="absolute inset-4 rounded-full overflow-hidden shadow-xl">
                                            <img
                                                src="/images/ilagan.png"
                                                alt="Ilagan City Logo"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>

                                        {/* Floating particles */}
                                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-300"></div>
                                        <div className="absolute top-1/4 -right-6 w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-500"></div>
                                        <div className="absolute bottom-1/3 -left-6 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-700"></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Search Bar */}
            {showStatistics && (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search by applicant name, project type, location, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-6 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <XCircle className="h-5 w-5" />
                        </button>
                    )}
                </div>
            )}

            {/* Only show content when statistics are visible */}
            {showStatistics && (
                <>
                    {/* Filter Indicator */}
                    {filterStatus !== "all" && (
                        <div className="flex items-center gap-2 text-sm">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                Showing:
                            </span>
                            <Badge className={getStatusColor(filterStatus)}>
                                {filterStatus.charAt(0).toUpperCase() +
                                    filterStatus.slice(1)}
                            </Badge>
                            <button
                                onClick={() => setFilterStatus("all")}
                                className="text-primary hover:underline ml-2"
                            >
                                Clear filter
                            </button>
                        </div>
                    )}

                    {/* Enhanced Requests Grid */}
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {paginatedRequests.map((request, index) => {
                            const hasVerifiedPayment =
                                request?.payment_verified &&
                                request?.certificate_number;
                            const statusColor = hasVerifiedPayment
                                ? "emerald"
                                : request?.status === "approved"
                                ? "emerald"
                                : request?.status === "rejected"
                                ? "rose"
                                : "amber";

                            return (
                                <Card
                                    key={`request-${request.id}-${index}`}
                                    className={`group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-white overflow-hidden ${
                                        hasVerifiedPayment
                                            ? "ring-2 ring-emerald-200"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        setSelectedRequest(request);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    {/* Status Header */}
                                    <div
                                        className={`h-2 bg-gradient-to-r ${
                                            hasVerifiedPayment
                                                ? "from-emerald-400 to-emerald-600"
                                                : request?.status === "approved"
                                                ? "from-emerald-400 to-emerald-600"
                                                : request?.status === "rejected"
                                                ? "from-rose-400 to-rose-600"
                                                : "from-amber-400 to-amber-600"
                                        }`}
                                    ></div>

                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <CardTitle className="text-xl font-bold text-gray-900">
                                                        Request #{request?.id}
                                                    </CardTitle>
                                                    {hasVerifiedPayment && (
                                                        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 rounded-full">
                                                            <Award className="h-3 w-3 text-emerald-600" />
                                                            <span className="text-xs font-medium text-emerald-700">
                                                                Certified
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <CalendarDays className="h-4 w-4" />
                                                    <span>
                                                        Submitted{" "}
                                                        {formatDate(
                                                            request?.created_at
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge
                                                className={`${getStatusColor(
                                                    request?.status || "pending"
                                                )} shadow-sm`}
                                            >
                                                <span className="flex items-center gap-1.5">
                                                    {getStatusIcon(
                                                        request?.status ||
                                                            "pending"
                                                    )}
                                                    {(
                                                        request?.status ||
                                                        "pending"
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        (
                                                            request?.status ||
                                                            "pending"
                                                        ).slice(1)}
                                                </span>
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Progress Indicator */}
                                        <div className="mb-6">
                                            <ProgressIndicator
                                                currentStatus={
                                                    hasVerifiedPayment
                                                        ? "certificate_issued"
                                                        : request?.status ||
                                                          "pending"
                                                }
                                                rejectionReason={
                                                    request?.report_description
                                                }
                                            />
                                        </div>

                                        {/* Certificate Section - Priority Display */}
                                        {hasVerifiedPayment && (
                                            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-emerald-200 rounded-full">
                                                        <Award className="h-4 w-4 text-emerald-700" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-emerald-900">
                                                            Certificate Ready
                                                        </h4>
                                                        <p className="text-xs text-emerald-700">
                                                            Your certificate is
                                                            available for
                                                            download
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <p className="text-xs font-medium text-emerald-600">
                                                            Certificate No.
                                                        </p>
                                                        <p className="font-mono font-semibold text-emerald-900">
                                                            {
                                                                request.certificate_number
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-emerald-600">
                                                            Issued
                                                        </p>
                                                        <p className="font-semibold text-emerald-900">
                                                            {formatDate(
                                                                request.certificate_issued_at
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-md"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <a
                                                            href={`/certificate/${request.certificate_id}/download`}
                                                        >
                                                            <Download className="h-3 w-3 mr-1" />
                                                            Download
                                                        </a>
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <a href="/receipt">
                                                            <Eye className="h-3 w-3 mr-1" />
                                                            Receipt
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Applicant & Project Info */}
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <User className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 truncate">
                                                        {request?.applicant_name ||
                                                            "Unknown Applicant"}
                                                    </p>
                                                    {request?.corporation_name && (
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {
                                                                request.corporation_name
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <MapPin className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-700 line-clamp-2">
                                                        {formatLocation(
                                                            request
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Project Summary */}
                                        <div className="pt-3 border-t border-gray-100 space-y-3">
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                {request?.project_type && (
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500">
                                                            Type
                                                        </p>
                                                        <p className="font-medium text-gray-900 truncate">
                                                            {
                                                                request.project_type
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                                {request?.lot_area_sqm && (
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500">
                                                            Area
                                                        </p>
                                                        <p className="font-medium text-gray-900">
                                                            {parseFloat(
                                                                request.lot_area_sqm
                                                            ).toLocaleString()}{" "}
                                                            sqm
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Payment Info for non-certified requests */}
                                            {!hasVerifiedPayment &&
                                                request?.payment_amount && (
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <DollarSign className="h-4 w-4 text-blue-600" />
                                                            <span className="text-sm font-medium text-blue-900">
                                                                Payment Required
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-blue-700">
                                                            ₱
                                                            {parseFloat(
                                                                request.payment_amount
                                                            ).toLocaleString()}
                                                        </p>
                                                    </div>
                                                )}

                                            {/* Rejection Reason Preview for rejected requests */}
                                            {request?.status === "rejected" &&
                                                request?.report_description && (
                                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <XCircle className="h-4 w-4 text-red-600" />
                                                            <span className="text-sm font-medium text-red-900">
                                                                Rejection Reason
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-red-700 line-clamp-2">
                                                            {request
                                                                .report_description
                                                                .length > 100
                                                                ? `${request.report_description.substring(
                                                                      0,
                                                                      100
                                                                  )}...`
                                                                : request.report_description}
                                                        </p>
                                                        <p className="text-xs text-red-600 mt-1 font-medium">
                                                            Click to view full
                                                            details
                                                        </p>
                                                    </div>
                                                )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {filteredRequests.length > itemsPerPage && (
                        <div className="mt-8 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.max(prev - 1, 1)
                                                )
                                            }
                                            disabled={currentPage === 1}
                                            className={
                                                currentPage === 1
                                                    ? "pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }
                                        />
                                    </PaginationItem>

                                    {/* Page numbers */}
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1
                                    ).map((page) => {
                                        // Show first page, last page, current page, and pages around current
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 &&
                                                page <= currentPage + 1)
                                        ) {
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        onClick={() =>
                                                            setCurrentPage(page)
                                                        }
                                                        isActive={
                                                            currentPage === page
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        } else if (
                                            page === currentPage - 2 ||
                                            page === currentPage + 2
                                        ) {
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            );
                                        }
                                        return null;
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(
                                                        prev + 1,
                                                        totalPages
                                                    )
                                                )
                                            }
                                            disabled={currentPage === totalPages}
                                            className={
                                                currentPage === totalPages
                                                    ? "pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}

                    {/* Pagination Info */}
                    {filteredRequests.length > 0 && (
                        <div className="text-center text-sm text-gray-600 mt-4">
                            Showing {startIndex + 1} to{" "}
                            {Math.min(endIndex, filteredRequests.length)} of{" "}
                            {filteredRequests.length} requests
                        </div>
                    )}

                    {/* No results message */}
                    {filteredRequests.length === 0 && (
                        <div className="text-center py-12">
                            <div className="rounded-full bg-muted p-6 mb-4 inline-block">
                                {searchTerm ? (
                                    <Search className="h-12 w-12 text-muted-foreground" />
                                ) : (
                                    <Filter className="h-12 w-12 text-muted-foreground" />
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {searchTerm
                                    ? `No results found for "${searchTerm}"`
                                    : `No ${filterStatus} requests found`}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {searchTerm
                                    ? "Try adjusting your search terms or clear the search to view all requests."
                                    : "Try selecting a different filter or view all requests."}
                            </p>
                            <div className="flex gap-2 justify-center">
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="text-primary hover:underline"
                                    >
                                        Clear search
                                    </button>
                                )}
                                {filterStatus !== "all" && (
                                    <button
                                        onClick={() => setFilterStatus("all")}
                                        className="text-primary hover:underline"
                                    >
                                        View all requests
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Request Details Modal - Compact Layout */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-[95vw] w-full max-h-[100vh] bg-white border border-blue-300 rounded-lg overflow-hidden">
                    <DialogHeader className="pb-3 bg-blue-600 text-white p-4 -m-6 mb-4 rounded-t-lg">
                        <DialogTitle className="text-lg font-bold text-white">
                            Request Details #{selectedRequest?.id}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-white">
                            Submitted on {formatDate(selectedRequest?.created_at)} • Status: {(selectedRequest?.status || "pending").charAt(0).toUpperCase() + (selectedRequest?.status || "pending").slice(1)}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Rejection Reason Alert - Only show for rejected requests */}
                    {selectedRequest?.status === "rejected" && selectedRequest?.report_description && (
                        <div className="mx-4 mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                            <div className="flex items-start gap-2">
                                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-red-800 mb-1">
                                        Application Rejected
                                    </h3>
                                    <p className="text-xs text-red-700 mb-2">Reason for rejection:</p>
                                    <div className="bg-white p-2 rounded border border-red-200">
                                        <p className="text-xs text-gray-800 leading-relaxed">
                                            {selectedRequest.report_description}
                                        </p>
                                    </div>
                                    <p className="text-xs text-red-600 mt-2">
                                        💡 Please review the feedback and submit a new application with corrections.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Grid - Compact 2 Column Layout */}
                    <div className="grid grid-cols-2 gap-4 py-2 overflow-y-auto max-h-[calc(90vh-160px)]">
                        {/* Left Column */}
                        <div className="space-y-3">
                            {/* Applicant Information */}
                            <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5 text-blue-600" />
                                    Applicant Information
                                </h3>
                                <div className="space-y-2 text-xs">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-[10px] font-medium text-gray-500">Applicant Name</p>
                                            <p className="font-semibold text-gray-900">{selectedRequest?.applicant_name || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-medium text-gray-500">Applicant Address</p>
                                            <p className="font-medium text-gray-900">{selectedRequest?.applicant_address || "N/A"}</p>
                                        </div>
                                    </div>
                                    {selectedRequest?.corporation_name && (
                                        <>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Corporation Name</p>
                                                <p className="font-semibold">{selectedRequest.corporation_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Corporation Address</p>
                                                <p className="font-medium">{selectedRequest.corporation_address || "N/A"}</p>
                                            </div>
                                        </>
                                    )}
                                    {selectedRequest?.authorized_representative_name && (
                                        <>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Authorized Representative</p>
                                                <p className="font-semibold">{selectedRequest.authorized_representative_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Representative Address</p>
                                                <p className="font-medium">{selectedRequest.authorized_representative_address || "N/A"}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Project Details */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-purple-600" />
                                    Project Details
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="grid grid-cols-2 gap-3">
                                        {selectedRequest?.project_type && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Project Type</p>
                                                <p className="font-semibold">{selectedRequest.project_type}</p>
                                            </div>
                                        )}
                                        {selectedRequest?.project_nature && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Project Nature</p>
                                                <p className="font-semibold">{selectedRequest.project_nature}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {selectedRequest?.project_nature_duration && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Project Duration</p>
                                                <p className="font-semibold">
                                                    {selectedRequest.project_nature_duration}
                                                    {selectedRequest.project_nature_years && ` (${selectedRequest.project_nature_years} years)`}
                                                </p>
                                            </div>
                                        )}
                                        {selectedRequest?.right_over_land && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Right Over Land</p>
                                                <p className="font-semibold">{selectedRequest.right_over_land}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {selectedRequest?.project_area_sqm && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Project Area</p>
                                                <p className="font-semibold">{parseFloat(selectedRequest.project_area_sqm).toLocaleString()} sqm</p>
                                            </div>
                                        )}
                                        {selectedRequest?.lot_area_sqm && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Lot Area</p>
                                                <p className="font-semibold">{parseFloat(selectedRequest.lot_area_sqm).toLocaleString()} sqm</p>
                                            </div>
                                        )}
                                        {selectedRequest?.bldg_improvement_sqm && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Building Area</p>
                                                <p className="font-semibold">{parseFloat(selectedRequest.bldg_improvement_sqm).toLocaleString()} sqm</p>
                                            </div>
                                        )}
                                    </div>
                                    {selectedRequest?.project_cost && (
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Project Cost</p>
                                            <p className="font-semibold">₱{parseFloat(selectedRequest.project_cost).toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6 overflow-y-auto pr-2">
                            {/* Project Location */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-green-600" />
                                    Project Location
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="grid grid-cols-2 gap-3">
                                        {selectedRequest?.project_location_number && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">House/Lot Number</p>
                                                <p className="font-semibold">{selectedRequest.project_location_number}</p>
                                            </div>
                                        )}
                                        {selectedRequest?.project_location_street && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Street</p>
                                                <p className="font-semibold">{selectedRequest.project_location_street}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {selectedRequest?.project_location_barangay && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Barangay</p>
                                                <p className="font-semibold">{selectedRequest.project_location_barangay}</p>
                                            </div>
                                        )}
                                        {(selectedRequest?.project_location_municipality || selectedRequest?.project_location_city) && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Municipality/City</p>
                                                <p className="font-semibold">{selectedRequest.project_location_municipality || selectedRequest.project_location_city}</p>
                                            </div>
                                        )}
                                        {selectedRequest?.project_location_province && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Province</p>
                                                <p className="font-semibold">{selectedRequest.project_location_province}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Land Use Information */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Home className="h-4 w-4 text-amber-600" />
                                    Land Use Information
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="grid grid-cols-2 gap-3">
                                        {selectedRequest?.existing_land_use && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Existing Land Use</p>
                                                <p className="font-semibold">{selectedRequest.existing_land_use}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Written Notice to Tenants</p>
                                            <p className="font-semibold">{selectedRequest?.has_written_notice === "yes" ? "Yes" : "No"}</p>
                                        </div>
                                    </div>
                                    {selectedRequest?.has_written_notice === "yes" && (
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedRequest.notice_officer_name && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500">Notice Officer Name</p>
                                                    <p className="font-semibold">{selectedRequest.notice_officer_name}</p>
                                                </div>
                                            )}
                                            {selectedRequest.notice_dates && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500">Notice Dates</p>
                                                    <p className="font-semibold">{selectedRequest.notice_dates}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Similar Application Filed</p>
                                            <p className="font-semibold">{selectedRequest?.has_similar_application === "yes" ? "Yes" : "No"}</p>
                                        </div>
                                    </div>
                                    {selectedRequest?.has_similar_application === "yes" && (
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedRequest.similar_application_offices && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500">Application Offices</p>
                                                    <p className="font-semibold">{selectedRequest.similar_application_offices}</p>
                                                </div>
                                            )}
                                            {selectedRequest.similar_application_dates && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500">Application Dates</p>
                                                    <p className="font-semibold">{selectedRequest.similar_application_dates}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Release Preference */}
                            {selectedRequest?.preferred_release_mode && (
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-teal-600" />
                                        Release Preference
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Preferred Release Mode</p>
                                            <p className="font-semibold capitalize">{selectedRequest.preferred_release_mode.replace("_", " ")}</p>
                                        </div>
                                        {selectedRequest.release_address && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Release Address</p>
                                                <p className="font-semibold">{selectedRequest.release_address}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Certificate Information */}
                            {selectedRequest?.payment_verified && selectedRequest?.certificate_number && (
                                <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
                                    <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        Certificate Information
                                    </h3>
                                    <div className="space-y-3 text-sm mb-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Certificate Number</p>
                                                <p className="font-bold text-emerald-900">{selectedRequest.certificate_number}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Issued</p>
                                                <p className="font-semibold text-emerald-800">{formatDate(selectedRequest.certificate_issued_at)}</p>
                                            </div>
                                        </div>
                                        {(selectedRequest.payment_amount || selectedRequest.payment_date) && (
                                            <div className="grid grid-cols-2 gap-3">
                                                {selectedRequest.payment_amount && (
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500">Amount Paid</p>
                                                        <p className="font-semibold text-emerald-800">₱{parseFloat(selectedRequest.payment_amount).toLocaleString()}</p>
                                                    </div>
                                                )}
                                                {selectedRequest.payment_date && (
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500">Payment Date</p>
                                                        <p className="font-semibold text-emerald-800">{formatDate(selectedRequest.payment_date)}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <a
                                            href={`/certificate/${selectedRequest.certificate_id}/download`}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                                        >
                                            <FileText className="h-4 w-4" />
                                            Download Certificate
                                        </a>
                                        <a
                                            href="/receipt"
                                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                                        >
                                            View Receipt
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">Created</p>
                                        <p className="font-semibold text-gray-900">{formatDate(selectedRequest?.created_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">Last Updated</p>
                                        <p className="font-semibold text-gray-900">{formatDate(selectedRequest?.updated_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

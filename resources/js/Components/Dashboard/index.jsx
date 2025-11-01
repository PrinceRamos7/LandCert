import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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

} from 'lucide-react';

export function Dashboard({ requests }) {
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const requestsData = requests?.data || requests || [];

    // Calculate enhanced statistics
    const stats = useMemo(() => {
        const total = requestsData.length;
        const pending = requestsData.filter(r => r.status === 'pending').length;
        const approved = requestsData.filter(r => r.status === 'approved').length;
        const rejected = requestsData.filter(r => r.status === 'rejected').length;
        const withCertificates = requestsData.filter(r => r.payment_verified && r.certificate_number).length;
        const recentRequests = requestsData.filter(r => {
            const requestDate = new Date(r.created_at);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return requestDate >= thirtyDaysAgo;
        }).length;
        
        return { total, pending, approved, rejected, withCertificates, recentRequests };
    }, [requestsData]);

    // Filter requests based on selected status
    const filteredRequests = useMemo(() => {
        if (filterStatus === 'all') return requestsData;
        return requestsData.filter(r => r.status === filterStatus);
    }, [requestsData, filterStatus]);

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

    const formatLocation = (request) => {
        const parts = [
            request?.project_location_street,
            request?.project_location_barangay,
            request?.project_location_city || request?.project_location_municipality,
            request?.project_location_province
        ].filter(Boolean);
        return parts.join(', ') || 'Location not specified';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Date not available';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    if (requests.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                {/* Welcome Section */}
                <div className="text-center mb-12">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                        <div className="relative rounded-full bg-gradient-to-br from-blue-50 to-emerald-50 p-12 shadow-2xl border border-blue-100">
                            <Building2 className="h-20 w-20 text-blue-600 mx-auto" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to LandCert</h1>
                    <p className="text-xl text-gray-600 mb-2">Your Land Certification Dashboard</p>
                    <p className="text-base text-gray-500 max-w-2xl mx-auto mb-8">
                        Submit and track your land certification requests with ease. Get started by creating your first application below.
                    </p>
                </div>

                {/* Quick Start Actions */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl mb-12">
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-dashed border-blue-200 hover:border-blue-400">
                        <CardContent className="p-6 text-center">
                            <div className="rounded-full bg-blue-100 p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                                <Plus className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">New Application</h3>
                            <p className="text-sm text-gray-600 mb-4">Start your land certification process</p>
                            <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
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
                            <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
                            <p className="text-sm text-gray-600 mb-4">Monitor your application status</p>
                            <Button variant="outline" className="w-full" disabled>
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
                            <h3 className="font-semibold text-gray-900 mb-2">Get Certificate</h3>
                            <p className="text-sm text-gray-600 mb-4">Download your certificates</p>
                            <Button variant="outline" className="w-full" disabled>
                                <Download className="h-4 w-4 mr-2" />
                                No Certificates
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Process Steps */}
                <div className="w-full max-w-4xl">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">How It Works</h2>
                    <div className="grid gap-6 md:grid-cols-4">
                        {[
                            { step: 1, title: "Submit", desc: "Fill out your application", icon: FileText, color: "blue" },
                            { step: 2, title: "Review", desc: "We process your request", icon: Clock, color: "amber" },
                            { step: 3, title: "Payment", desc: "Complete the payment", icon: DollarSign, color: "emerald" },
                            { step: 4, title: "Certificate", desc: "Download your certificate", icon: Award, color: "purple" }
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className={`rounded-full bg-${item.color}-100 p-4 w-16 h-16 mx-auto mb-4`}>
                                    <item.icon className={`h-8 w-8 text-${item.color}-600`} />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">{item.step}. {item.title}</h3>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                    <p className="text-gray-600 mt-1">Track and manage your land certification requests</p>
                </div>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all">
                    <a href="/request">
                        <Plus className="h-4 w-4 mr-2" />
                        New Application
                    </a>
                </Button>
            </div>

            {/* Enhanced Statistics Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200" onClick={() => setFilterStatus('all')}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700 mb-1">Total</p>
                                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                                <p className="text-xs text-blue-600 mt-1">All requests</p>
                            </div>
                            <div className="p-3 bg-blue-200 rounded-full group-hover:bg-blue-300 transition-colors">
                                <FileText className="h-6 w-6 text-blue-700" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-0 bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200" onClick={() => setFilterStatus('pending')}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-amber-700 mb-1">Pending</p>
                                <p className="text-3xl font-bold text-amber-900">{stats.pending}</p>
                                <p className="text-xs text-amber-600 mt-1">Under review</p>
                            </div>
                            <div className="p-3 bg-amber-200 rounded-full group-hover:bg-amber-300 transition-colors">
                                <Clock className="h-6 w-6 text-amber-700" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200" onClick={() => setFilterStatus('approved')}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-700 mb-1">Approved</p>
                                <p className="text-3xl font-bold text-emerald-900">{stats.approved}</p>
                                <p className="text-xs text-emerald-600 mt-1">Completed</p>
                            </div>
                            <div className="p-3 bg-emerald-200 rounded-full group-hover:bg-emerald-300 transition-colors">
                                <CheckCircle2 className="h-6 w-6 text-emerald-700" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-0 bg-gradient-to-br from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200" onClick={() => setFilterStatus('rejected')}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-rose-700 mb-1">Rejected</p>
                                <p className="text-3xl font-bold text-rose-900">{stats.rejected}</p>
                                <p className="text-xs text-rose-600 mt-1">Need action</p>
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
                                <p className="text-sm font-medium text-purple-700 mb-1">Certificates</p>
                                <p className="text-3xl font-bold text-purple-900">{stats.withCertificates}</p>
                                <p className="text-xs text-purple-600 mt-1">Ready</p>
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
                                <p className="text-sm font-medium text-indigo-700 mb-1">Recent</p>
                                <p className="text-3xl font-bold text-indigo-900">{stats.recentRequests}</p>
                                <p className="text-xs text-indigo-600 mt-1">Last 30 days</p>
                            </div>
                            <div className="p-3 bg-indigo-200 rounded-full group-hover:bg-indigo-300 transition-colors">
                                <TrendingUp className="h-6 w-6 text-indigo-700" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Indicator */}
            {filterStatus !== 'all' && (
                <div className="flex items-center gap-2 text-sm">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Showing:</span>
                    <Badge className={getStatusColor(filterStatus)}>
                        {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                    </Badge>
                    <button 
                        onClick={() => setFilterStatus('all')}
                        className="text-primary hover:underline ml-2"
                    >
                        Clear filter
                    </button>
                </div>
            )}

            {/* Enhanced Requests Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredRequests.map((request) => {
                    const hasVerifiedPayment = request?.payment_verified && request?.certificate_number;
                    const statusColor = hasVerifiedPayment ? 'emerald' : 
                                      request?.status === 'approved' ? 'emerald' :
                                      request?.status === 'rejected' ? 'rose' : 'amber';
                    
                    return (
                        <Card 
                            key={request.id} 
                            className={`group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-white overflow-hidden ${
                                hasVerifiedPayment ? 'ring-2 ring-emerald-200' : ''
                            }`}
                            onClick={() => {
                                setSelectedRequest(request);
                                setIsModalOpen(true);
                            }}
                        >
                            {/* Status Header */}
                            <div className={`h-2 bg-gradient-to-r ${
                                hasVerifiedPayment ? 'from-emerald-400 to-emerald-600' :
                                request?.status === 'approved' ? 'from-emerald-400 to-emerald-600' :
                                request?.status === 'rejected' ? 'from-rose-400 to-rose-600' : 
                                'from-amber-400 to-amber-600'
                            }`}></div>

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
                                                    <span className="text-xs font-medium text-emerald-700">Certified</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CalendarDays className="h-4 w-4" />
                                            <span>Submitted {formatDate(request?.created_at)}</span>
                                        </div>
                                    </div>
                                    <Badge className={`${getStatusColor(request?.status || 'pending')} shadow-sm`}>
                                        <span className="flex items-center gap-1.5">
                                            {getStatusIcon(request?.status || 'pending')}
                                            {(request?.status || 'pending').charAt(0).toUpperCase() + (request?.status || 'pending').slice(1)}
                                        </span>
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Certificate Section - Priority Display */}
                                {hasVerifiedPayment && (
                                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-emerald-200 rounded-full">
                                                <Award className="h-4 w-4 text-emerald-700" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-emerald-900">Certificate Ready</h4>
                                                <p className="text-xs text-emerald-700">Your certificate is available for download</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <p className="text-xs font-medium text-emerald-600">Certificate No.</p>
                                                <p className="font-mono font-semibold text-emerald-900">{request.certificate_number}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-emerald-600">Issued</p>
                                                <p className="font-semibold text-emerald-900">{formatDate(request.certificate_issued_at)}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <Button 
                                                asChild 
                                                size="sm" 
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-md"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <a href={`/certificate/${request.certificate_id}/download`}>
                                                    <Download className="h-3 w-3 mr-1" />
                                                    Download
                                                </a>
                                            </Button>
                                            <Button 
                                                asChild 
                                                variant="outline" 
                                                size="sm"
                                                onClick={(e) => e.stopPropagation()}
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
                                                {request?.applicant_name || 'Unknown Applicant'}
                                            </p>
                                            {request?.corporation_name && (
                                                <p className="text-sm text-gray-600 truncate">
                                                    {request.corporation_name}
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
                                                {formatLocation(request)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Summary */}
                                <div className="pt-3 border-t border-gray-100 space-y-3">
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        {request?.project_type && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Type</p>
                                                <p className="font-medium text-gray-900 truncate">{request.project_type}</p>
                                            </div>
                                        )}
                                        {request?.lot_area_sqm && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Area</p>
                                                <p className="font-medium text-gray-900">{parseFloat(request.lot_area_sqm).toLocaleString()} sqm</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Payment Info for non-certified requests */}
                                    {!hasVerifiedPayment && request?.payment_amount && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <DollarSign className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-900">Payment Required</span>
                                            </div>
                                            <p className="text-sm text-blue-700">₱{parseFloat(request.payment_amount).toLocaleString()}</p>
                                        </div>
                                    )}

                                    {/* Rejection Reason Preview for rejected requests */}
                                    {request?.status === 'rejected' && request?.report_description && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <XCircle className="h-4 w-4 text-red-600" />
                                                <span className="text-sm font-medium text-red-900">Rejection Reason</span>
                                            </div>
                                            <p className="text-sm text-red-700 line-clamp-2">
                                                {request.report_description.length > 100 
                                                    ? `${request.report_description.substring(0, 100)}...` 
                                                    : request.report_description}
                                            </p>
                                            <p className="text-xs text-red-600 mt-1 font-medium">Click to view full details</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* No results message */}
            {filteredRequests.length === 0 && filterStatus !== 'all' && (
                <div className="text-center py-12">
                    <div className="rounded-full bg-muted p-6 mb-4 inline-block">
                        <Filter className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No {filterStatus} requests found
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Try selecting a different filter or view all requests.
                    </p>
                    <button 
                        onClick={() => setFilterStatus('all')}
                        className="text-primary hover:underline"
                    >
                        View all requests
                    </button>
                </div>
            )}

            {/* Request Details Modal - Enhanced Landscape Layout */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-[80vw] w-full max-h-[80vh] overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 border-0 shadow-2xl rounded-3xl">
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
                        
                        {/* Rejection Reason Alert - Only show for rejected requests */}
                        {selectedRequest?.status === 'rejected' && selectedRequest?.report_description && (
                            <div className="mx-6 mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <h3 className="text-sm font-semibold text-red-800">
                                            Application Rejected
                                        </h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p className="font-medium mb-1">Reason for rejection:</p>
                                            <div className="bg-white p-3 rounded border border-red-200">
                                                <p className="text-gray-800 leading-relaxed">{selectedRequest.report_description}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 text-xs text-red-600">
                                            <p>💡 Please review the feedback above and submit a new application with the necessary corrections.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="overflow-y-auto max-h-[calc(80vh-200px)] pr-2">

                    {selectedRequest && (
                        <div className="space-y-6 mt-6">
                            {/* Applicant Information */}
                            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-5 border border-blue-100">
                                <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                    Applicant Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded-md border border-blue-100">
                                        <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Applicant Name</p>
                                        <p className="font-semibold text-gray-900">{selectedRequest.applicant_name || 'N/A'}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-md border border-blue-100">
                                        <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Applicant Address</p>
                                        <p className="font-medium text-gray-700">{selectedRequest.applicant_address || 'N/A'}</p>
                                    </div>
                                    {selectedRequest.corporation_name && (
                                        <>
                                            <div className="bg-white p-3 rounded-md border border-blue-100">
                                                <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Corporation Name</p>
                                                <p className="font-semibold text-gray-900">{selectedRequest.corporation_name}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border border-blue-100">
                                                <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Corporation Address</p>
                                                <p className="font-medium text-gray-700">{selectedRequest.corporation_address || 'N/A'}</p>
                                            </div>
                                        </>
                                    )}
                                    {selectedRequest.authorized_representative_name && (
                                        <>
                                            <div className="bg-white p-3 rounded-md border border-blue-100">
                                                <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Authorized Representative</p>
                                                <p className="font-semibold text-gray-900">{selectedRequest.authorized_representative_name}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border border-blue-100">
                                                <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Representative Address</p>
                                                <p className="font-medium text-gray-700">{selectedRequest.authorized_representative_address || 'N/A'}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Project Details */}
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-5 border border-emerald-100">
                                <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <Building2 className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    Project Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedRequest.project_type && (
                                        <div className="bg-white p-3 rounded-md border border-emerald-100">
                                            <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">Project Type</p>
                                            <p className="font-semibold text-gray-900">{selectedRequest.project_type}</p>
                                        </div>
                                    )}
                                    {selectedRequest.project_nature && (
                                        <div className="bg-white p-3 rounded-md border border-emerald-100">
                                            <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">Project Nature</p>
                                            <p className="font-semibold text-gray-900">{selectedRequest.project_nature}</p>
                                        </div>
                                    )}
                                    <div className="md:col-span-2 bg-white p-3 rounded-md border border-emerald-100">
                                        <p className="text-xs font-semibold text-emerald-600 uppercase mb-1 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            Project Location
                                        </p>
                                        <p className="font-medium text-gray-700">{formatLocation(selectedRequest)}</p>
                                    </div>
                                    {selectedRequest.lot_area_sqm && (
                                        <div className="bg-white p-3 rounded-md border border-emerald-100">
                                            <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">Lot Area</p>
                                            <p className="font-semibold text-gray-900">{parseFloat(selectedRequest.lot_area_sqm).toLocaleString()} sqm</p>
                                        </div>
                                    )}
                                    {selectedRequest.bldg_improvement_sqm && (
                                        <div className="bg-white p-3 rounded-md border border-emerald-100">
                                            <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">Building/Improvement Area</p>
                                            <p className="font-semibold text-gray-900">{parseFloat(selectedRequest.bldg_improvement_sqm).toLocaleString()} sqm</p>
                                        </div>
                                    )}
                                    {selectedRequest.project_area_sqm && (
                                        <div className="bg-white p-3 rounded-md border border-emerald-100">
                                            <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">Project Area</p>
                                            <p className="font-semibold text-gray-900">{parseFloat(selectedRequest.project_area_sqm).toLocaleString()} sqm</p>
                                        </div>
                                    )}
                                    {selectedRequest.right_over_land && (
                                        <div className="bg-white p-3 rounded-md border border-emerald-100">
                                            <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">Right Over Land</p>
                                            <p className="font-semibold text-gray-900">{selectedRequest.right_over_land}</p>
                                        </div>
                                    )}
                                    {selectedRequest.project_cost && (
                                        <div className="bg-white p-3 rounded-md border border-emerald-100">
                                            <p className="text-xs font-semibold text-emerald-600 uppercase mb-1 flex items-center gap-1">
                                                <DollarSign className="h-3 w-3" />
                                                Project Cost
                                            </p>
                                            <p className="font-semibold text-gray-900">₱{parseFloat(selectedRequest.project_cost).toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Land Use Information */}
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-5 border border-amber-100">
                                <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-amber-100 rounded-lg">
                                        <Home className="h-5 w-5 text-amber-600" />
                                    </div>
                                    Land Use Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedRequest.existing_land_use && (
                                        <div className="bg-white p-3 rounded-md border border-amber-100">
                                            <p className="text-xs font-semibold text-amber-600 uppercase mb-1">Existing Land Use</p>
                                            <p className="font-semibold text-gray-900">{selectedRequest.existing_land_use}</p>
                                        </div>
                                    )}
                                    {selectedRequest.project_nature_duration && (
                                        <div className="bg-white p-3 rounded-md border border-amber-100">
                                            <p className="text-xs font-semibold text-amber-600 uppercase mb-1">Project Duration</p>
                                            <p className="font-semibold text-gray-900">
                                                {selectedRequest.project_nature_duration}
                                                {selectedRequest.project_nature_years && ` (${selectedRequest.project_nature_years} years)`}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Additional Information */}
                            {(selectedRequest.has_written_notice || selectedRequest.has_similar_application || selectedRequest.preferred_release_mode) && (
                                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-5 border border-purple-100">
                                    <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2 mb-4">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Briefcase className="h-5 w-5 text-purple-600" />
                                        </div>
                                        Additional Information
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedRequest.has_written_notice === 'yes' && (
                                            <div className="bg-white p-4 rounded-md border border-purple-100">
                                                <p className="text-xs font-semibold text-purple-600 uppercase mb-2">Written Notice Sent</p>
                                                <p className="font-semibold text-gray-900 mb-2">Yes</p>
                                                {selectedRequest.notice_officer_name && (
                                                    <p className="text-sm text-gray-700 mt-1"><span className="font-medium">Officer:</span> {selectedRequest.notice_officer_name}</p>
                                                )}
                                                {selectedRequest.notice_dates && (
                                                    <p className="text-sm text-gray-700"><span className="font-medium">Dates:</span> {selectedRequest.notice_dates}</p>
                                                )}
                                            </div>
                                        )}
                                        {selectedRequest.has_similar_application === 'yes' && (
                                            <div className="bg-white p-4 rounded-md border border-purple-100">
                                                <p className="text-xs font-semibold text-purple-600 uppercase mb-2">Similar Application Filed</p>
                                                <p className="font-semibold text-gray-900 mb-2">Yes</p>
                                                {selectedRequest.similar_application_offices && (
                                                    <p className="text-sm text-gray-700 mt-1"><span className="font-medium">Offices:</span> {selectedRequest.similar_application_offices}</p>
                                                )}
                                                {selectedRequest.similar_application_dates && (
                                                    <p className="text-sm text-gray-700"><span className="font-medium">Dates:</span> {selectedRequest.similar_application_dates}</p>
                                                )}
                                            </div>
                                        )}
                                        {selectedRequest.preferred_release_mode && (
                                            <div className="bg-white p-4 rounded-md border border-purple-100">
                                                <p className="text-xs font-semibold text-purple-600 uppercase mb-2">Preferred Release Mode</p>
                                                <p className="font-semibold text-gray-900 capitalize mb-2">{selectedRequest.preferred_release_mode.replace('_', ' ')}</p>
                                                {selectedRequest.release_address && (
                                                    <p className="text-sm text-gray-700 mt-1"><span className="font-medium">Address:</span> {selectedRequest.release_address}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Certificate Information */}
                            {selectedRequest?.payment_verified && selectedRequest?.certificate_number && (
                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-5 border border-emerald-200">
                                    <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2 mb-4">
                                        <div className="p-2 bg-emerald-100 rounded-lg">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        Certificate Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="bg-white p-4 rounded-md border border-emerald-100">
                                            <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">Certificate Number</p>
                                            <p className="font-bold text-emerald-900 text-lg">{selectedRequest.certificate_number}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-md border border-emerald-100">
                                            <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">Issued</p>
                                            <p className="font-semibold text-emerald-800">{formatDate(selectedRequest.certificate_issued_at)}</p>
                                        </div>
                                        {selectedRequest.payment_amount && (
                                            <div className="bg-white p-4 rounded-md border border-emerald-100">
                                                <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">Amount Paid</p>
                                                <p className="font-semibold text-emerald-800">₱{parseFloat(selectedRequest.payment_amount).toLocaleString()}</p>
                                            </div>
                                        )}
                                        {selectedRequest.payment_date && (
                                            <div className="bg-white p-4 rounded-md border border-emerald-100">
                                                <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">Payment Date</p>
                                                <p className="font-semibold text-emerald-800">{formatDate(selectedRequest.payment_date)}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <a 
                                            href={`/certificate/${selectedRequest.certificate_id}/download`}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
                                        >
                                            <FileText className="h-5 w-5" />
                                            Download Certificate
                                        </a>
                                        <a 
                                            href="/receipt"
                                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        >
                                            View Receipt
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4 border border-slate-200">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Created</p>
                                        <p className="font-medium text-gray-900">{formatDate(selectedRequest.created_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Last Updated</p>
                                        <p className="font-medium text-gray-900">{formatDate(selectedRequest.updated_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

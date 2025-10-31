import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    Briefcase
} from 'lucide-react';

export function Dashboard({ requests }) {
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const requestsData = requests?.data || requests || [];

    // Calculate statistics
    const stats = useMemo(() => {
        const total = requestsData.length;
        const pending = requestsData.filter(r => r.status === 'pending').length;
        const approved = requestsData.filter(r => r.status === 'approved').length;
        const rejected = requestsData.filter(r => r.status === 'rejected').length;
        
        return { total, pending, approved, rejected };
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
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="rounded-full bg-gradient-to-br from-blue-100 to-blue-200 p-8 mb-6 shadow-lg">
                    <Building2 className="h-16 w-16 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No requests yet</h3>
                <p className="text-base text-gray-600 text-center max-w-md mb-8">
                    Get started by submitting your first land certification request. Your applications will appear here.
                </p>
                <a 
                    href="/request" 
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    <FileText className="h-5 w-5 mr-2" />
                    Submit New Request
                </a>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50" onClick={() => setFilterStatus('all')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-900">Total Requests</CardTitle>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-700">{stats.total}</div>
                        <p className="text-xs text-blue-600 mt-1">All submissions</p>
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

            {/* Requests Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredRequests.map((request) => (
                    <Card 
                        key={request.id} 
                        className="hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer border-t-4 border-t-blue-500 bg-white"
                        onClick={() => {
                            setSelectedRequest(request);
                            setIsModalOpen(true);
                        }}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-2">
                                <CardTitle className="text-lg font-semibold">
                                    Request #{request?.id}
                                </CardTitle>
                                <Badge className={getStatusColor(request?.status || 'pending')}>
                                    <span className="flex items-center gap-1">
                                        {getStatusIcon(request?.status || 'pending')}
                                        {(request?.status || 'pending').charAt(0).toUpperCase() + (request?.status || 'pending').slice(1)}
                                    </span>
                                </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" />
                                {formatDate(request?.created_at)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Applicant Info */}
                            <div className="flex items-start gap-2">
                                <User className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-sm truncate">
                                        {request?.applicant_name || 'Unknown Applicant'}
                                    </p>
                                    {request?.corporation_name && (
                                        <p className="text-xs text-muted-foreground truncate">
                                            {request.corporation_name}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            {/* Location */}
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                                    {formatLocation(request)}
                                </p>
                            </div>

                            {/* Payment & Certificate Info */}
                            {request?.payment_verified && request?.certificate_number && (
                                <div className="pt-3 border-t bg-emerald-50 rounded-lg p-3 space-y-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        <span className="text-sm font-medium text-emerald-800">Verified</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-emerald-600 font-medium">Certificate Number:</p>
                                        <p className="text-sm font-semibold text-emerald-800">{request.certificate_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-emerald-600 font-medium">Issued:</p>
                                        <p className="text-sm font-medium text-emerald-800">{formatDate(request.certificate_issued_at)}</p>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <a 
                                            href={`/certificate/${request.certificate_id}/download`}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-2 px-3 rounded-md flex items-center justify-center gap-1 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <FileText className="h-3 w-3" />
                                            Download Certificate
                                        </a>
                                        <a 
                                            href="/receipt"
                                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium py-2 px-3 rounded-md flex items-center justify-center gap-1 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            View Receipt
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Project Details */}
                            <div className="pt-3 border-t space-y-2">
                                {request?.project_type && (
                                    <div>
                                        <p className="text-xs text-muted-foreground">Project Type</p>
                                        <p className="text-sm font-medium">{request.project_type}</p>
                                    </div>
                                )}
                                {request?.project_nature && (
                                    <div>
                                        <p className="text-xs text-muted-foreground">Nature</p>
                                        <p className="text-sm font-medium">{request.project_nature}</p>
                                    </div>
                                )}
                                {request?.lot_area_sqm && (
                                    <div>
                                        <p className="text-xs text-muted-foreground">Lot Area</p>
                                        <p className="text-sm font-medium">{parseFloat(request.lot_area_sqm).toLocaleString()} sqm</p>
                                    </div>
                                )}
                                {request?.payment_verified && request?.payment_amount && (
                                    <div>
                                        <p className="text-xs text-muted-foreground">Amount Paid</p>
                                        <p className="text-sm font-medium">₱{parseFloat(request.payment_amount).toLocaleString()}</p>
                                    </div>
                                )}
                                {request?.payment_verified && request?.payment_date && (
                                    <div>
                                        <p className="text-xs text-muted-foreground">Payment Date</p>
                                        <p className="text-sm font-medium">{formatDate(request.payment_date)}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
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

            {/* Request Details Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="border-b pb-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <DialogTitle className="text-2xl font-bold text-blue-900">
                                    Request #{selectedRequest?.id}
                                </DialogTitle>
                                <DialogDescription className="flex items-center gap-2 mt-2 text-base">
                                    <CalendarDays className="h-4 w-4" />
                                    Submitted on {formatDate(selectedRequest?.created_at)}
                                </DialogDescription>
                            </div>
                            <Badge className={`${getStatusColor(selectedRequest?.status || 'pending')} text-base px-5 py-2.5`}>
                                <span className="flex items-center gap-3">
                                    {getStatusIcon(selectedRequest?.status || 'pending')}
                                    {(selectedRequest?.status || 'pending').charAt(0).toUpperCase() + (selectedRequest?.status || 'pending').slice(1)}
                                </span>
                            </Badge>
                        </div>
                    </DialogHeader>

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
                </DialogContent>
            </Dialog>
        </div>
    );
}

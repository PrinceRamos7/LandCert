import { CheckCircle2, XCircle, Clock } from "lucide-react";

/**
 * Get status badge color classes
 */
export const getStatusColor = (status) => {
    switch (status) {
        case "approved":
            return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-300";
        case "rejected":
            return "bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-300";
        default:
            return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300";
    }
};

/**
 * Get status icon component
 */
export const getStatusIcon = (status) => {
    switch (status) {
        case "approved":
            return <CheckCircle2 className="h-4 w-4" />;
        case "rejected":
            return <XCircle className="h-4 w-4" />;
        default:
            return <Clock className="h-4 w-4" />;
    }
};

/**
 * Format location from request object
 */
export const formatLocation = (request) => {
    const parts = [
        request?.project_location_street,
        request?.project_location_barangay,
        request?.project_location_city || request?.project_location_municipality,
        request?.project_location_province,
    ].filter(Boolean);
    return parts.join(", ") || "Location not specified";
};

/**
 * Format date string
 */
export const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

/**
 * Calculate statistics from requests array
 */
export const calculateStats = (requests) => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "pending").length;
    const approved = requests.filter((r) => r.status === "approved").length;
    const rejected = requests.filter((r) => r.status === "rejected").length;
    const withCertificates = requests.filter(
        (r) => r.payment_verified && r.certificate_number
    ).length;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRequests = requests.filter((r) => {
        const requestDate = new Date(r.created_at);
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
};

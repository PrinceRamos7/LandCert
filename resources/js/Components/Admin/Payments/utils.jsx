import { CheckCircle2, XCircle, Clock } from "lucide-react";

/**
 * Get status badge color classes based on payment status
 */
export const getStatusColor = (status) => {
    switch (status) {
        case "verified":
            return "bg-emerald-100 text-emerald-800 border-emerald-300";
        case "rejected":
            return "bg-rose-100 text-rose-800 border-rose-300";
        default:
            return "bg-blue-100 text-blue-800 border-blue-300";
    }
};

/**
 * Get status icon component based on payment status
 */
export const getStatusIcon = (status) => {
    switch (status) {
        case "verified":
            return <CheckCircle2 className="h-4 w-4" />;
        case "rejected":
            return <XCircle className="h-4 w-4" />;
        default:
            return <Clock className="h-4 w-4" />;
    }
};

/**
 * Format date string to readable format
 */
export const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount) => {
    if (!amount) return "₱0.00";
    return `₱${parseFloat(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

// Utility functions for AuditLog component

export const getActionBadge = (action) => {
    const variants = {
        created: "default",
        updated: "secondary",
        deleted: "destructive",
        viewed: "outline",
        exported: "secondary",
        login: "default",
        logout: "secondary",
        failed_login: "destructive",
        bulk_created: "default",
        bulk_updated: "secondary",
        bulk_deleted: "destructive",
    };

    return variants[action] || "outline";
};

export const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Manila",
    });
};

export const formatActionLabel = (action) => {
    return action.replace("_", " ").toUpperCase();
};

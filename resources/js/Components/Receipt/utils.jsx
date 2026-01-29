// Utility functions for Receipt component

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

export const getStatusIcon = (status) => {
    const icons = {
        verified: "CheckCircle2",
        rejected: "XCircle",
        default: "Clock",
    };
    return icons[status] || icons.default;
};

export const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const validateReceiptForm = (formData) => {
    const errors = [];

    if (!formData.receipt_file) {
        errors.push({
            title: "Receipt File Required",
            description: "Please upload a receipt file to proceed with your payment submission.",
        });
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
        errors.push({
            title: "Invalid Amount",
            description: "Please enter a valid payment amount greater than zero.",
        });
    }

    if (formData.payment_method !== "cash" && !formData.receipt_number) {
        errors.push({
            title: "Receipt Number Required",
            description: "Receipt or reference number is required for non-cash payments. Please provide the transaction reference.",
        });
    }

    if (formData.payment_method === "other" && !formData.other_method.trim()) {
        errors.push({
            title: "Payment Method Required",
            description: "Please specify the payment method you used for this transaction.",
        });
    }

    return errors;
};

export const createFormData = (selectedRequest, formData) => {
    const data = new FormData();
    data.append("request_id", selectedRequest.id);
    data.append("amount", formData.amount);
    data.append("payment_method", formData.payment_method);
    data.append("receipt_number", formData.receipt_number);
    data.append("payment_date", formData.payment_date);
    data.append("notes", formData.notes);
    data.append("receipt_file", formData.receipt_file);
    return data;
};

export const getInitialFormData = () => ({
    amount: "",
    payment_method: "cash",
    receipt_number: "",
    payment_date: new Date().toISOString().split("T")[0],
    notes: "",
    receipt_file: null,
    other_method: "",
});

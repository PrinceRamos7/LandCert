import React from "react";
import { FileText } from "lucide-react";

export function EmptyState() {
    return (
        <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No approved applications found</p>
            <p className="text-sm text-gray-400 mt-2">
                Applications must be approved before you can submit payment
            </p>
        </div>
    );
}

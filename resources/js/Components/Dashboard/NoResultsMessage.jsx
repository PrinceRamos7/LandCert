import React from "react";
import { Search, Filter } from "lucide-react";

export function NoResultsMessage({
    searchTerm,
    filterStatus,
    onClearSearch,
    onClearFilter,
}) {
    return (
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
                        onClick={onClearSearch}
                        className="text-primary hover:underline"
                    >
                        Clear search
                    </button>
                )}
                {filterStatus !== "all" && (
                    <button
                        onClick={onClearFilter}
                        className="text-primary hover:underline"
                    >
                        Clear filter
                    </button>
                )}
            </div>
        </div>
    );
}

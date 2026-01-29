import React from "react";
import { RequestCard } from "./RequestCard";

export function RequestGrid({ requests, onRequestClick }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {requests.map((request, index) => (
                <RequestCard
                    key={`request-${request.id}-${index}`}
                    request={request}
                    onClick={() => onRequestClick(request)}
                />
            ))}
        </div>
    );
}

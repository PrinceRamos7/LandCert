import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    Download,
    Search,
    Filter,
    Eye,
    Calendar,
    User,
    Activity,
    X,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { router } from "@inertiajs/react";

export function AuditLogComponent({
    logs,
    users,
    actions,
    modelTypes,
    filters,
}) {
    const [selectedLog, setSelectedLog] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters || {});

    const handleFilter = () => {
        router.get(route("admin.audit-logs"), localFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setLocalFilters({});
        router.get(
            route("admin.audit-logs"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleExport = () => {
        window.location.href = route("admin.audit-logs.export", localFilters);
    };

    const handleViewDetails = (log) => {
        setSelectedLog(log);
        setShowDetails(true);
    };

    const handlePageChange = (url) => {
        if (url) {
            router.get(url, localFilters, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const getActionBadge = (action) => {
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

        return (
            <Badge variant={variants[action] || "outline"} className="text-xs">
                {action.replace("_", " ").toUpperCase()}
            </Badge>
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Manila",
        });
    };

    const renderPaginationLinks = () => {
        if (!logs?.links || logs.links.length <= 3) return null;

        return (
            <Pagination className="mt-4">
                <PaginationContent>
                    {logs.links.map((link, index) => {
                        if (index === 0) {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationPrevious
                                        onClick={() =>
                                            handlePageChange(link.url)
                                        }
                                        className={
                                            !link.url
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>
                            );
                        }

                        if (index === logs.links.length - 1) {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationNext
                                        onClick={() =>
                                            handlePageChange(link.url)
                                        }
                                        className={
                                            !link.url
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>
                            );
                        }

                        if (link.label === "...") {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }

                        return (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    onClick={() => handlePageChange(link.url)}
                                    isActive={link.active}
                                    className="cursor-pointer"
                                >
                                    {link.label}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}
                </PaginationContent>
            </Pagination>
        );
    };

    return (
        <>
            {/* Filters Card */}
            <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
                <CardHeader 
                    className="bg-blue-600 border-b border-blue-700 p-3 cursor-pointer hover:bg-blue-700 transition-colors"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <CardTitle className="text-lg font-bold flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Filter className="h-4 w-4 text-white" />
                            </div>
                            Filters
                        </div>
                        {showFilters ? (
                            <ChevronUp className="h-5 w-5 text-white" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-white" />
                        )}
                    </CardTitle>
                </CardHeader>
                {showFilters && (
                    <CardContent className="p-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {/* Search */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-700">
                                Search
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="Search description, user, IP..."
                                    value={localFilters.search || ""}
                                    onChange={(e) =>
                                        setLocalFilters({
                                            ...localFilters,
                                            search: e.target.value,
                                        })
                                    }
                                    className="pl-9 h-9 text-sm"
                                />
                            </div>
                        </div>

                        {/* User Filter */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-700">
                                User
                            </label>
                            <Select
                                value={
                                    localFilters.user_id
                                        ? localFilters.user_id.toString()
                                        : "all"
                                }
                                onValueChange={(value) =>
                                    setLocalFilters({
                                        ...localFilters,
                                        user_id: value === "all" ? "" : value,
                                    })
                                }
                            >
                                <SelectTrigger className="h-9 text-sm">
                                    <SelectValue placeholder="All users" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All users
                                    </SelectItem>
                                    {users.map((user) => (
                                        <SelectItem
                                            key={user.id}
                                            value={user.id.toString()}
                                        >
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Action Filter */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-700">
                                Action
                            </label>
                            <Select
                                value={
                                    localFilters.action
                                        ? localFilters.action
                                        : "all"
                                }
                                onValueChange={(value) =>
                                    setLocalFilters({
                                        ...localFilters,
                                        action: value === "all" ? "" : value,
                                    })
                                }
                            >
                                <SelectTrigger className="h-9 text-sm">
                                    <SelectValue placeholder="All actions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All actions
                                    </SelectItem>
                                    {actions.map((action) => (
                                        <SelectItem key={action} value={action}>
                                            {action
                                                .replace("_", " ")
                                                .toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Model Type Filter */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-700">
                                Model Type
                            </label>
                            <Select
                                value={
                                    localFilters.model_type
                                        ? localFilters.model_type
                                        : "all"
                                }
                                onValueChange={(value) =>
                                    setLocalFilters({
                                        ...localFilters,
                                        model_type:
                                            value === "all" ? "" : value,
                                    })
                                }
                            >
                                <SelectTrigger className="h-9 text-sm">
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All types
                                    </SelectItem>
                                    {modelTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date From */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-700">
                                Date From
                            </label>
                            <Input
                                type="date"
                                value={localFilters.date_from || ""}
                                onChange={(e) =>
                                    setLocalFilters({
                                        ...localFilters,
                                        date_from: e.target.value,
                                    })
                                }
                                className="h-9 text-sm"
                            />
                        </div>

                        {/* Date To */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-700">
                                Date To
                            </label>
                            <Input
                                type="date"
                                value={localFilters.date_to || ""}
                                onChange={(e) =>
                                    setLocalFilters({
                                        ...localFilters,
                                        date_to: e.target.value,
                                    })
                                }
                                className="h-9 text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                        <Button
                            onClick={handleFilter}
                            className="bg-blue-600 hover:bg-blue-700 h-9 text-sm"
                            size="sm"
                        >
                            <Filter className="mr-1.5 h-3.5 w-3.5" />
                            Apply Filters
                        </Button>
                        <Button onClick={handleClearFilters} variant="outline" size="sm" className="h-9 text-sm">
                            <X className="mr-1.5 h-3.5 w-3.5" />
                            Clear
                        </Button>
                    </div>
                </CardContent>
                )}
            </Card>

            {/* Audit Logs Table */}
            <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <CardHeader className="bg-blue-600 border-b border-blue-700 p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
                                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Activity className="h-5 w-5 text-white" />
                                </div>
                                Activity History
                            </CardTitle>
                            <p className="text-blue-100 mt-1 text-sm">
                                Total: {logs.total} records
                            </p>
                        </div>
                        <Button
                            onClick={handleExport}
                            variant="outline"
                            size="sm"
                            className="gap-1 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm h-8 text-xs"
                        >
                            <Download className="h-3.5 w-3.5" />
                            Export PDF
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs">Date & Time</TableHead>
                                    <TableHead className="text-xs">User</TableHead>
                                    <TableHead className="text-xs">Action</TableHead>
                                    <TableHead className="text-xs">Description</TableHead>
                                    <TableHead className="text-xs">Model</TableHead>
                                    <TableHead className="text-xs">IP Address</TableHead>
                                    <TableHead className="text-right text-xs">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center py-6 text-gray-500 text-sm"
                                        >
                                            No audit logs found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.data.map((log) => (
                                        <TableRow
                                            key={log.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <TableCell className="whitespace-nowrap py-2">
                                                <div className="flex items-center text-xs">
                                                    <Calendar className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
                                                    {formatDate(log.created_at)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-2">
                                                <div className="flex items-center">
                                                    <User className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
                                                    <div>
                                                        <div className="font-medium text-xs">
                                                            {log.user_name ||
                                                                "System"}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {log.user_email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-2">
                                                {getActionBadge(log.action)}
                                            </TableCell>
                                            <TableCell className="max-w-md truncate text-xs py-2">
                                                {log.description}
                                            </TableCell>
                                            <TableCell className="py-2">
                                                {log.model_type && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {log.model_type}
                                                        {log.model_id &&
                                                            ` #${log.model_id}`}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs py-2">
                                                {log.ip_address}
                                            </TableCell>
                                            <TableCell className="text-right py-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleViewDetails(log)
                                                    }
                                                    className="h-7 w-7 p-0"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {renderPaginationLinks()}
                </CardContent>
            </Card>

            {/* Details Dialog */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
                    <DialogHeader className="bg-blue-600 p-3 rounded-t-lg sticky top-0 z-10">
                        <DialogTitle className="text-base font-bold flex items-center gap-2 !text-white">
                            <Eye className="h-4 w-4 text-white" />
                            <span className="text-white">
                                Audit Log Details
                            </span>
                        </DialogTitle>
                    </DialogHeader>
                    {selectedLog && (
                        <div className="p-3 space-y-2.5 overflow-y-auto max-h-[calc(90vh-64px)]">
                            {/* Top Row - User Info and Action */}
                            <div className="grid grid-cols-2 gap-2.5">
                                {/* User Information */}
                                <div className="bg-blue-50 rounded-md p-2.5 border border-blue-200">
                                    <h3 className="text-xs font-semibold text-blue-900 mb-1.5 flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        User Information
                                    </h3>
                                    <div className="space-y-1.5">
                                        <div>
                                            <label className="text-xs font-medium text-gray-600">
                                                User
                                            </label>
                                            <p className="mt-0.5 text-sm font-medium text-gray-900">
                                                {selectedLog.user_name ||
                                                    "System"}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {selectedLog.user_email}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-600">
                                                Action
                                            </label>
                                            <p className="mt-0.5">
                                                {getActionBadge(
                                                    selectedLog.action
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Details */}
                                <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
                                    <h3 className="text-xs font-semibold text-gray-900 mb-1.5 flex items-center gap-1">
                                        <Activity className="h-3 w-3" />
                                        Action Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <div>
                                            <label className="text-xs font-medium text-gray-600">
                                                Date & Time
                                            </label>
                                            <p className="mt-0.5 text-xs text-gray-900">
                                                {formatDate(
                                                    selectedLog.created_at
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-600">
                                                IP Address
                                            </label>
                                            <p className="mt-0.5 font-mono text-xs text-gray-900">
                                                {selectedLog.ip_address}
                                            </p>
                                        </div>
                                        {selectedLog.model_type && (
                                            <div>
                                                <label className="text-xs font-medium text-gray-600">
                                                    Model
                                                </label>
                                                <p className="mt-0.5 text-xs text-gray-900">
                                                    {selectedLog.model_type}
                                                    {selectedLog.model_id &&
                                                        ` #${selectedLog.model_id}`}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-xs font-medium text-gray-600">
                                                Method
                                            </label>
                                            <p className="mt-0.5 text-xs text-gray-900">
                                                {selectedLog.method}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description - Full Width */}
                            <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
                                <label className="text-xs font-medium text-gray-600">
                                    Description
                                </label>
                                <p className="mt-0.5 text-sm text-gray-900">
                                    {selectedLog.description}
                                </p>
                            </div>

                            {/* Technical Details - Full Width */}
                            <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
                                <h3 className="text-xs font-semibold text-gray-900 mb-1.5">
                                    Technical Details
                                </h3>
                                <div className="grid grid-cols-2 gap-2.5">
                                    <div>
                                        <label className="text-xs font-medium text-gray-600">
                                            URL
                                        </label>
                                        <p className="mt-0.5 text-xs text-gray-900 break-all">
                                            {selectedLog.url}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-600">
                                            User Agent
                                        </label>
                                        <p className="mt-0.5 text-xs text-gray-600 break-all">
                                            {selectedLog.user_agent}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {selectedLog.old_values &&
                                Object.keys(selectedLog.old_values).length >
                                    0 && (
                                    <div className="bg-amber-50 rounded-md p-2.5 border border-amber-200">
                                        <h3 className="text-xs font-semibold text-amber-900 mb-1.5 flex items-center gap-1">
                                            <Activity className="h-3 w-3" />
                                            Changes Made
                                        </h3>
                                        <div className="space-y-1.5">
                                            {Object.keys(
                                                selectedLog.old_values
                                            ).map((key) => {
                                                const oldValue =
                                                    selectedLog.old_values[key];
                                                const newValue =
                                                    selectedLog.new_values?.[
                                                        key
                                                    ];
                                                if (oldValue !== newValue) {
                                                    return (
                                                        <div
                                                            key={key}
                                                            className="bg-white rounded-md border border-amber-200 p-2"
                                                        >
                                                            <div className="font-semibold text-xs text-gray-900 mb-1 capitalize">
                                                                {key.replace(
                                                                    /_/g,
                                                                    " "
                                                                )}
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-1.5">
                                                                <div className="bg-red-50 rounded p-1.5 border border-red-200">
                                                                    <span className="text-xs font-medium text-red-700">
                                                                        Before:
                                                                    </span>
                                                                    <p className="text-xs text-gray-900 mt-0.5 break-words">
                                                                        {oldValue || (
                                                                            <span className="text-gray-400 italic">
                                                                                (empty)
                                                                            </span>
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                <div className="bg-green-50 rounded p-1.5 border border-green-200">
                                                                    <span className="text-xs font-medium text-green-700">
                                                                        After:
                                                                    </span>
                                                                    <p className="text-xs text-gray-900 mt-0.5 break-words">
                                                                        {newValue || (
                                                                            <span className="text-gray-400 italic">
                                                                                (empty)
                                                                            </span>
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    </div>
                                )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

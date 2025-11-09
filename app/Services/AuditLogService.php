<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditLogService
{
    /**
     * Log an action
     */
    public static function log(
        string $action,
        string $description,
        ?string $modelType = null,
        ?int $modelId = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?array $metadata = null
    ) {
        $user = Auth::user();

        return AuditLog::create([
            'user_id' => $user?->id,
            'user_name' => $user?->name,
            'user_email' => $user?->email,
            'user_type' => $user?->user_type,
            'action' => $action,
            'model_type' => $modelType,
            'model_id' => $modelId,
            'description' => $description,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'url' => Request::fullUrl(),
            'method' => Request::method(),
            'metadata' => $metadata,
        ]);
    }

    /**
     * Log a create action
     */
    public static function logCreate(string $modelType, ?int $modelId, array $values, string $description = null)
    {
        return self::log(
            'created',
            $description ?? "Created new {$modelType}",
            $modelType,
            $modelId,
            null,
            $values
        );
    }

    /**
     * Log an update action
     */
    public static function logUpdate(string $modelType, ?int $modelId, array $oldValues, array $newValues, string $description = null)
    {
        return self::log(
            'updated',
            $description ?? "Updated {$modelType}",
            $modelType,
            $modelId,
            $oldValues,
            $newValues
        );
    }

    /**
     * Log a delete action
     */
    public static function logDelete(string $modelType, ?int $modelId, array $values, string $description = null)
    {
        return self::log(
            'deleted',
            $description ?? "Deleted {$modelType}",
            $modelType,
            $modelId,
            $values,
            null
        );
    }

    /**
     * Log a view action
     */
    public static function logView(string $modelType, ?int $modelId, string $description = null)
    {
        return self::log(
            'viewed',
            $description ?? "Viewed {$modelType}",
            $modelType,
            $modelId
        );
    }

    /**
     * Log an export action
     */
    public static function logExport(string $exportType, int $recordCount, string $format = 'pdf')
    {
        return self::log(
            'exported',
            "Exported {$recordCount} {$exportType} records as {$format}",
            $exportType,
            null,
            null,
            null,
            ['record_count' => $recordCount, 'format' => $format]
        );
    }

    /**
     * Log a login action
     */
    public static function logLogin()
    {
        return self::log(
            'login',
            'User logged in',
            'User',
            Auth::id()
        );
    }

    /**
     * Log a logout action
     */
    public static function logLogout()
    {
        return self::log(
            'logout',
            'User logged out',
            'User',
            Auth::id()
        );
    }

    /**
     * Log a failed login attempt
     */
    public static function logFailedLogin(string $email)
    {
        $log = new AuditLog();
        $log->user_name = $email;
        $log->user_email = $email;
        $log->action = 'failed_login';
        $log->description = 'Failed login attempt';
        $log->ip_address = Request::ip();
        $log->user_agent = Request::userAgent();
        $log->url = Request::fullUrl();
        $log->method = Request::method();
        $log->save();

        return $log;
    }

    /**
     * Log bulk action
     */
    public static function logBulkAction(string $action, string $modelType, array $ids, string $description = null)
    {
        return self::log(
            "bulk_{$action}",
            $description ?? "Bulk {$action} on " . count($ids) . " {$modelType} records",
            $modelType,
            null,
            null,
            null,
            ['affected_ids' => $ids, 'count' => count($ids)]
        );
    }
}

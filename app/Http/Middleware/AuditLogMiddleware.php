<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\AuditLogService;
use Illuminate\Support\Facades\Auth;

class AuditLogMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only log for authenticated users
        if (Auth::check()) {
            $this->logRequest($request, $response);
        }

        return $response;
    }

    /**
     * Log the request
     */
    private function logRequest(Request $request, Response $response)
    {
        // Skip logging for certain routes
        $skipRoutes = [
            'sanctum/csrf-cookie',
            'api/user',
            '_ignition',
        ];

        foreach ($skipRoutes as $route) {
            if (str_contains($request->path(), $route)) {
                return;
            }
        }

        // Log specific actions based on route and method
        $method = $request->method();
        $path = $request->path();

        // Only log important actions (not GET requests for viewing pages)
        if ($method === 'GET' && !str_contains($path, 'export')) {
            return;
        }

        // Log the action
        $this->logAction($request, $method, $path);
    }

    /**
     * Log specific action
     */
    private function logAction(Request $request, string $method, string $path)
    {
        $description = $this->getActionDescription($method, $path, $request);

        if ($description) {
            AuditLogService::log(
                $this->getActionType($method),
                $description,
                $this->getModelType($path),
                $this->getModelId($request),
                null,
                null,
                ['path' => $path]
            );
        }
    }

    /**
     * Get action description
     */
    private function getActionDescription(string $method, string $path, Request $request): ?string
    {
        if (str_contains($path, 'export')) {
            return 'Exported data';
        }

        return null; // Let specific controllers handle detailed logging
    }

    /**
     * Get action type
     */
    private function getActionType(string $method): string
    {
        return match($method) {
            'POST' => 'created',
            'PUT', 'PATCH' => 'updated',
            'DELETE' => 'deleted',
            'GET' => 'viewed',
            default => 'action',
        };
    }

    /**
     * Get model type from path
     */
    private function getModelType(string $path): ?string
    {
        if (str_contains($path, 'request')) return 'Request';
        if (str_contains($path, 'payment')) return 'Payment';
        if (str_contains($path, 'application')) return 'Application';
        if (str_contains($path, 'user')) return 'User';
        if (str_contains($path, 'report')) return 'Report';

        return null;
    }

    /**
     * Get model ID from request
     */
    private function getModelId(Request $request): ?int
    {
        // Try to get ID from route parameters
        $id = $request->route('id') 
            ?? $request->route('requestId')
            ?? $request->route('paymentId')
            ?? $request->route('userId')
            ?? $request->route('reportId');

        return $id ? (int) $id : null;
    }
}

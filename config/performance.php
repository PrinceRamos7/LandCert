<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Pagination Settings
    |--------------------------------------------------------------------------
    |
    | Default pagination limits for different sections of the application.
    | These values are optimized for government-scale usage.
    |
    */
    'pagination' => [
        'default' => 25,
        'dashboard' => 25,
        'requests' => 25,
        'applications' => 25,
        'payments' => 25,
        'users' => 25,
        'max_per_page' => 100, // Maximum allowed per page
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Settings
    |--------------------------------------------------------------------------
    |
    | Cache TTL (Time To Live) in seconds for different data types.
    |
    */
    'cache' => [
        'dashboard_analytics' => 300, // 5 minutes
        'statistics' => 300, // 5 minutes
        'reports' => 600, // 10 minutes
    ],

    /*
    |--------------------------------------------------------------------------
    | Export Settings
    |--------------------------------------------------------------------------
    |
    | Settings for PDF and CSV exports.
    |
    */
    'exports' => [
        'chunk_size' => 1000, // Process exports in chunks of 1000 records
        'use_queue' => true, // Use queue for large exports
        'queue_threshold' => 500, // Queue exports with more than 500 records
        'timeout' => 300, // 5 minutes timeout for export jobs
    ],

    /*
    |--------------------------------------------------------------------------
    | Query Optimization
    |--------------------------------------------------------------------------
    |
    | Settings for database query optimization.
    |
    */
    'query' => [
        'eager_load' => true, // Enable eager loading by default
        'select_specific' => true, // Select only needed columns
        'chunk_processing' => 1000, // Chunk size for bulk operations
    ],
];

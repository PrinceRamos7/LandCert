<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\AdminController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [RequestController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Request routes
    Route::get('/request', [RequestController::class, 'index'])->name('request.index');
    Route::post('/request', [RequestController::class, 'store'])->name('request.store');
    
    // Payment routes
    Route::get('/receipt', [\App\Http\Controllers\PaymentController::class, 'index'])->name('receipt.index');
    Route::post('/receipt', [\App\Http\Controllers\PaymentController::class, 'store'])->name('receipt.store');
    
    // Certificate download
    Route::get('/certificate/{certificateId}/download', [\App\Http\Controllers\PaymentController::class, 'downloadCertificate'])->name('certificate.download');
});

// Admin routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/requests', [AdminController::class, 'requests'])->name('requests');
    Route::get('/applications', [AdminController::class, 'applications'])->name('applications');
    Route::get('/reports', function () {
        return Inertia::render('Admin/Reports');
    })->name('reports');
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::put('/users/{userId}', [AdminController::class, 'updateUser'])->name('users.update');
    Route::delete('/users/{userId}', [AdminController::class, 'deleteUser'])->name('users.delete');
    Route::post('/update-evaluation/{reportId}', [AdminController::class, 'updateEvaluation'])->name('update-evaluation');
    Route::delete('/delete-request/{requestId}', [AdminController::class, 'deleteRequest'])->name('delete-request');
    
    // Payment verification routes
    Route::get('/payments', [AdminController::class, 'payments'])->name('payments');
    Route::post('/payments/{paymentId}/verify', [AdminController::class, 'verifyPayment'])->name('payments.verify');
    Route::post('/payments/{paymentId}/reject', [AdminController::class, 'rejectPayment'])->name('payments.reject');
});

require __DIR__.'/auth.php';

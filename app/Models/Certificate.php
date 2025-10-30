<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Certificate extends Model
{
    protected $fillable = [
        'request_id',
        'application_id',
        'payment_id',
        'certificate_number',
        'certificate_file_path',
        'issued_by',
        'issued_at',
        'valid_until',
        'status',
        'notes',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'valid_until' => 'date',
    ];

    /**
     * Get the request that owns the certificate.
     */
    public function request(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Request::class, 'request_id');
    }

    /**
     * Get the application that owns the certificate.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class, 'application_id');
    }

    /**
     * Get the payment that owns the certificate.
     */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class, 'payment_id');
    }

    /**
     * Get the user who issued the certificate.
     */
    public function issuer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    /**
     * Generate a unique certificate number.
     */
    public static function generateCertificateNumber(): string
    {
        $year = date('Y');
        $lastCert = self::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();
        
        $number = $lastCert ? (int)substr($lastCert->certificate_number, -5) + 1 : 1;
        
        return 'CERT-' . $year . '-' . str_pad($number, 5, '0', STR_PAD_LEFT);
    }
}

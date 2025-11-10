<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class CertificateIssued extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $certificate;
    public $applicantName;
    public $certificateNumber;

    /**
     * Create a new message instance.
     */
    public function __construct($certificate, $applicantName, $certificateNumber)
    {
        $this->certificate = $certificate;
        $this->applicantName = $applicantName;
        $this->certificateNumber = $certificateNumber;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Payment Successfully Verified - Certificate Ready for Download!',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.certificate-issued',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        // Attach the certificate PDF
        if ($this->certificate->certificate_file_path && file_exists(storage_path('app/public/' . $this->certificate->certificate_file_path))) {
            return [
                Attachment::fromPath(storage_path('app/public/' . $this->certificate->certificate_file_path))
                    ->as('Certificate-' . $this->certificateNumber . '.pdf')
                    ->withMime('application/pdf'),
            ];
        }
        
        return [];
    }
}

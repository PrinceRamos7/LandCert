<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate Issued</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
        }
        .success-badge {
            background: #10b981;
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            display: inline-block;
            font-weight: bold;
            margin: 20px 0;
        }
        .info-box {
            background: white;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .button {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 14px;
        }
        .highlight {
            color: #10b981;
            font-weight: bold;
        }
        .certificate-icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="certificate-icon">✅</div>
        <h1>Payment Successfully Verified!</h1>
    </div>
    
    <div class="content">
        <p>Dear <strong>{{ $applicantName }}</strong>,</p>
        
        <div class="success-badge">
            ✓ PAYMENT VERIFIED & APPROVED
        </div>
        
        <p>Excellent news! Your payment has been successfully verified and your land certification application has been <strong>approved</strong>. Your official certificate has been generated and is ready for download.</p>
        
        <div class="info-box">
            <p><strong>Certificate Details:</strong></p>
            <p>Certificate Number: <span class="highlight">{{ $certificateNumber }}</span></p>
            <p>Issued Date: <span class="highlight">{{ $certificate->issued_at->format('F d, Y') }}</span></p>
            @if($certificate->valid_until)
            <p>Valid Until: <span class="highlight">{{ \Carbon\Carbon::parse($certificate->valid_until)->format('F d, Y') }}</span></p>
            @endif
        </div>
        
        <h3>📥 Download Your Certificate</h3>
        <p>Your official certificate is attached to this email as a PDF file. You can also access it anytime through your account dashboard.</p>
        
        <div class="info-box">
            <p><strong>How to Access Your Certificate:</strong></p>
            <ol>
                <li><strong>Email Attachment:</strong> Download the PDF file attached to this email</li>
                <li><strong>Receipt Page:</strong> Login to your account and go to the "Payment Receipt" page</li>
                <li><strong>Download Button:</strong> Look for the green "Download Certificate" button</li>
                <li><strong>Certificate Info:</strong> Your certificate details will be displayed in a green verification box</li>
            </ol>
        </div>
        
        <center>
            <a href="{{ url('/receipt') }}" class="button">Access Receipt Page</a>
        </center>
        
        <div class="info-box">
            <p><strong>🎉 Application Process Complete:</strong></p>
            <ul>
                <li>✅ Application submitted and reviewed</li>
                <li>✅ Payment received and verified</li>
                <li>✅ Certificate officially issued</li>
                <li>✅ Ready for download and use</li>
            </ul>
        </div>
        
        <div class="info-box">
            <p><strong>⚠️ Important Notes:</strong></p>
            <ul>
                <li>Keep this certificate in a safe place</li>
                <li>This is an official document</li>
                <li>Present this certificate when required</li>
                <li>Contact us if you need additional copies</li>
            </ul>
        </div>
        
        <p>Thank you for using our services!</p>
        
        <p>Best regards,<br>
        <strong>City Planning and Development Office</strong><br>
        Land Certification Department</p>
    </div>
    
    <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>&copy; {{ date('Y') }} LandCert. All rights reserved.</p>
    </div>
</body>
</html>

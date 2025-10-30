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
        <div class="certificate-icon">📜</div>
        <h1>Certificate Issued!</h1>
    </div>
    
    <div class="content">
        <p>Dear <strong>{{ $applicantName }}</strong>,</p>
        
        <div class="success-badge">
            ✓ CERTIFICATE READY
        </div>
        
        <p>Congratulations! Your land certification has been successfully processed and issued.</p>
        
        <div class="info-box">
            <p><strong>Certificate Details:</strong></p>
            <p>Certificate Number: <span class="highlight">{{ $certificateNumber }}</span></p>
            <p>Issued Date: <span class="highlight">{{ $certificate->issued_at->format('F d, Y') }}</span></p>
            @if($certificate->valid_until)
            <p>Valid Until: <span class="highlight">{{ \Carbon\Carbon::parse($certificate->valid_until)->format('F d, Y') }}</span></p>
            @endif
        </div>
        
        <h3>📥 Your Certificate</h3>
        <p>Your certificate is attached to this email as a PDF file. You can also download it anytime from your account.</p>
        
        <div class="info-box">
            <p><strong>How to Access Your Certificate:</strong></p>
            <ol>
                <li>Download the attached PDF file</li>
                <li>Or login to your account and go to the Receipt page</li>
                <li>Click the "Download Certificate" button</li>
            </ol>
        </div>
        
        <center>
            <a href="{{ url('/receipt') }}" class="button">View in Dashboard</a>
        </center>
        
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

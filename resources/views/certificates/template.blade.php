<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Land Certificate - {{ $certificateNumber }}</title>
    <style>
        @page {
            margin: 0;
        }
        body {
            font-family: 'Times New Roman', serif;
            margin: 0;
            padding: 40px;
            background: white;
        }
        .certificate {
            border: 15px solid #1e40af;
            padding: 40px;
            min-height: 90vh;
            position: relative;
        }
        .inner-border {
            border: 3px solid #3b82f6;
            padding: 30px;
            min-height: 85vh;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            width: 100px;
            height: 100px;
            margin: 0 auto 20px;
        }
        .title {
            font-size: 36px;
            font-weight: bold;
            color: #1e40af;
            margin: 20px 0;
            text-transform: uppercase;
            letter-spacing: 3px;
        }
        .subtitle {
            font-size: 18px;
            color: #64748b;
            margin: 10px 0;
        }
        .cert-number {
            font-size: 14px;
            color: #64748b;
            margin: 20px 0;
            font-weight: bold;
        }
        .content {
            margin: 40px 0;
            text-align: center;
            line-height: 2;
        }
        .content p {
            font-size: 16px;
            margin: 15px 0;
        }
        .applicant-name {
            font-size: 28px;
            font-weight: bold;
            color: #1e40af;
            text-decoration: underline;
            margin: 20px 0;
        }
        .details {
            margin: 30px 0;
            text-align: left;
        }
        .detail-row {
            margin: 10px 0;
            font-size: 14px;
        }
        .detail-label {
            font-weight: bold;
            display: inline-block;
            width: 200px;
        }
        .signatures {
            margin-top: 60px;
            display: table;
            width: 100%;
        }
        .signature-block {
            display: table-cell;
            text-align: center;
            padding: 20px;
        }
        .signature-line {
            border-top: 2px solid #000;
            margin-top: 50px;
            padding-top: 10px;
            font-weight: bold;
        }
        .signature-title {
            font-size: 12px;
            color: #64748b;
        }
        .footer {
            position: absolute;
            bottom: 40px;
            left: 40px;
            right: 40px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }
        .seal {
            position: absolute;
            bottom: 150px;
            left: 80px;
            width: 120px;
            height: 120px;
            border: 3px solid #1e40af;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            text-align: center;
            color: #1e40af;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="inner-border">
            <div class="header">
                <div class="logo">
                    <!-- You can add logo here -->
                    <div style="width: 100px; height: 100px; border: 3px solid #1e40af; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                        <span style="font-size: 40px; color: #1e40af;">🏛️</span>
                    </div>
                </div>
                <h1 class="title">Land Certificate</h1>
                <p class="subtitle">City Planning and Development Office</p>
                <p class="subtitle">Ilagan City, Isabela</p>
                <p class="cert-number">Certificate No: {{ $certificateNumber }}</p>
            </div>

            <div class="content">
                <p>This is to certify that</p>
                <p class="applicant-name">{{ $applicantName }}</p>
                <p>has been granted land certification for the property located at:</p>
                <p style="font-weight: bold; font-size: 18px;">{{ $projectLocation }}</p>
            </div>

            <div class="details">
                <div class="detail-row">
                    <span class="detail-label">Project Type:</span>
                    <span>{{ $projectType }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Project Nature:</span>
                    <span>{{ $projectNature }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Lot Area:</span>
                    <span>{{ $lotArea }} square meters</span>
                </div>
                @if($projectCost)
                <div class="detail-row">
                    <span class="detail-label">Project Cost:</span>
                    <span>₱{{ number_format($projectCost, 2) }}</span>
                </div>
                @endif
                <div class="detail-row">
                    <span class="detail-label">Date Issued:</span>
                    <span>{{ $issuedDate }}</span>
                </div>
                @if($validUntil)
                <div class="detail-row">
                    <span class="detail-label">Valid Until:</span>
                    <span>{{ $validUntil }}</span>
                </div>
                @endif
            </div>

            <div class="signatures">
                <div class="signature-block">
                    <div class="signature-line">
                        {{ $issuedBy }}
                    </div>
                    <div class="signature-title">
                        City Planning Officer
                    </div>
                </div>
                <div class="signature-block">
                    <div class="signature-line">
                        _____________________
                    </div>
                    <div class="signature-title">
                        City Mayor
                    </div>
                </div>
            </div>

            <div class="seal">
                OFFICIAL<br>SEAL
            </div>

            <div class="footer">
                <p>This certificate is issued in accordance with the City Planning and Development Office regulations.</p>
                <p>Document ID: {{ $certificateNumber }} | Issued: {{ $issuedDate }}</p>
            </div>
        </div>
    </div>
</body>
</html>

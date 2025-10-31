<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Land Use Certificate - {{ $certificateNumber }}</title>
    <style>
        @page {
            margin: 0;
            size: A4;
        }
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background: white;
            color: #000;
            line-height: 1.4;
        }
        .certificate {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            box-sizing: border-box;
            position: relative;
        }
        
        /* Header Section */
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
        }
        .logos {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .logo {
            width: 80px;
            height: 80px;
        }
        .logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .header-text {
            flex: 1;
            margin: 0 20px;
        }
        .republic {
            font-size: 12px;
            font-weight: bold;
            margin: 2px 0;
        }
        .office-name {
            font-size: 11px;
            font-weight: bold;
            margin: 1px 0;
        }
        .address {
            font-size: 10px;
            margin: 1px 0;
        }
        .cert-id {
            font-size: 10px;
            margin-top: 10px;
            text-align: left;
        }
        
        /* Title Section */
        .title-section {
            text-align: center;
            margin: 40px 0;
        }
        .main-title {
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 30px 0;
            text-transform: uppercase;
        }
        
        /* Content Section */
        .content {
            margin: 40px 0;
            text-align: justify;
            font-size: 14px;
            line-height: 1.8;
        }
        .content p {
            margin: 15px 0;
            text-indent: 50px;
        }
        .applicant-name {
            font-weight: bold;
            text-decoration: underline;
            font-size: 16px;
        }
        .project-details {
            font-weight: bold;
        }
        
        /* Details Table */
        .details-section {
            margin: 30px 0;
        }
        .details-table {
            width: 100%;
            margin: 20px 0;
        }
        .details-table td {
            padding: 8px 0;
            font-size: 13px;
            vertical-align: top;
        }
        .details-table .label {
            width: 180px;
            font-weight: bold;
        }
        .details-table .colon {
            width: 20px;
        }
        
        /* Issue Date */
        .issue-date {
            margin: 40px 0;
            text-align: justify;
            font-size: 14px;
        }
        .issue-date p {
            text-indent: 50px;
        }
        .date-highlight {
            font-weight: bold;
            text-decoration: underline;
        }
        
        /* Signature Section */
        .signature-section {
            margin-top: 60px;
            text-align: right;
            padding-right: 50px;
        }
        .signature-name {
            font-weight: bold;
            font-size: 14px;
            margin-top: 60px;
            text-decoration: underline;
        }
        .signature-title {
            font-size: 12px;
            margin: 5px 0;
        }
        
        /* Footer */
        .footer {
            position: absolute;
            bottom: 20mm;
            left: 20mm;
            right: 20mm;
            text-align: center;
        }
        .footer-logo {
            width: 60px;
            height: 60px;
            margin: 0 auto;
        }
        .footer-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        
        /* Watermark */
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(0, 0, 0, 0.05);
            font-weight: bold;
            z-index: -1;
            pointer-events: none;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <!-- Watermark -->
        <div class="watermark">OFFICIAL</div>
        
        <!-- Header -->
        <div class="header">
            <div class="header-text">
                <div class="republic">Republic of the Philippines</div>
                <div class="office-name">CITY PLANNING AND DEVELOPMENT OFFICE</div>
                <div class="office-name">CITY DISASTER RISK REDUCTION AND MANAGEMENT OFFICE</div>
                <div class="office-name">ILAGAN CITY, ISABELA</div>
                <div class="address">City Hall Complex, Maharlika Highway, Ilagan City</div>
            </div>
            <div class="cert-id">
                LCPSA-{{ $certificateNumber }}
            </div>
        </div>
        
        <!-- Title -->
        <div class="title-section">
            <h1 class="main-title">C E R T I F I C A T I O N</h1>
        </div>
        
        <!-- Content -->
        <div class="content">
            <p>This is to certify that <span class="applicant-name">{{ strtoupper($applicantName) }}</span>, has satisfactorily complied with the land use requirements and regulations of the City Planning and Development Office covering the property located at <span class="project-details">{{ $projectLocation }}</span> for a <span class="project-details">{{ $projectType }}</span> project.</p>
        </div>
        
        <!-- Details -->
        <div class="details-section">
            <table class="details-table">
                <tr>
                    <td class="label">Project Type</td>
                    <td class="colon">:</td>
                    <td>{{ $projectType }}</td>
                </tr>
                <tr>
                    <td class="label">Project Nature</td>
                    <td class="colon">:</td>
                    <td>{{ $projectNature }}</td>
                </tr>
                <tr>
                    <td class="label">Lot Area</td>
                    <td class="colon">:</td>
                    <td>{{ $lotArea }} square meters</td>
                </tr>
                @if($projectCost)
                <tr>
                    <td class="label">Project Cost</td>
                    <td class="colon">:</td>
                    <td>₱{{ number_format($projectCost, 2) }}</td>
                </tr>
                @endif
                <tr>
                    <td class="label">Certificate Number</td>
                    <td class="colon">:</td>
                    <td>{{ $certificateNumber }}</td>
                </tr>
                @if($validUntil)
                <tr>
                    <td class="label">Valid Until</td>
                    <td class="colon">:</td>
                    <td>{{ $validUntil }}</td>
                </tr>
                @endif
            </table>
        </div>
        
        <!-- Issue Date -->
        <div class="issue-date">
            <p>Issued this <span class="date-highlight">{{ date('jS', strtotime($issuedDate)) }}</span> day of <span class="date-highlight">{{ date('F Y', strtotime($issuedDate)) }}</span> at Ilagan City, Isabela.</p>
        </div>
        
        <!-- Signature -->
        <div class="signature-section">
            <div class="signature-name">{{ strtoupper($issuedBy) }}</div>
            <div class="signature-title">City Planning Officer</div>
            <div class="signature-title">Officer-in-Charge</div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-text">
                <strong>CITY OF ILAGAN</strong><br>
                Official Seal
            </div>
        </div>
    </div>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Land Use Certificate - {{ $certificateNumber }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            position: relative;
        }
        .logo-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .logo-placeholder {
            width: 80px;
            height: 80px;
            border: 2px solid #333;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            text-align: center;
            background-color: #f0f0f0;
        }
        .header-text {
            flex: 1;
            text-align: center;
            margin: 0 20px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
        }
        .content {
            margin: 20px 0;
        }
        .signature {
            margin-top: 60px;
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-container">
            <div class="logo-placeholder">
                ILAGAN<br>CITY<br>SEAL
            </div>
            <div class="header-text">
                <h2>Republic of the Philippines</h2>
                <h3>CITY PLANNING AND DEVELOPMENT OFFICE</h3>
                <h3>CITY DISASTER RISK REDUCTION AND MANAGEMENT OFFICE</h3>
                <h3>ILAGAN CITY, ISABELA</h3>
                <p>City Hall Complex, Maharlika Highway, Ilagan City</p>
            </div>
            <div class="logo-placeholder">
                CDRRMO<br>SEAL
            </div>
        </div>
    </div>

    <div class="title">
        <center>C E R T I F I C A T I O N</center>
    </div>

    <div class="content">
        <p><strong>Certificate Number:</strong> {{ $certificateNumber }}</p>
        <p><strong>Applicant Name:</strong> {{ $applicantName }}</p>
        <p><strong>Project Location:</strong> {{ $projectLocation }}</p>
        <p><strong>Project Type:</strong> {{ $projectType }}</p>
        <p><strong>Project Nature:</strong> {{ $projectNature }}</p>
        <p><strong>Lot Area:</strong> {{ $lotArea }} sqm</p>
        
        <p style="margin-top: 30px;">
            This is to certify that the above-mentioned project has been reviewed and approved 
            in accordance with the applicable land use regulations and zoning ordinances of 
            Ilagan City, Isabela.
        </p>
        
        <p><strong>Date Issued:</strong> {{ $issuedDate }}</p>
        <p><strong>Valid Until:</strong> {{ $validUntil }}</p>
    </div>

    <div class="signature">
        <p>{{ $issuedBy }}</p>
        <p>City Planning and Development Officer</p>
    </div>
</body>
</html>
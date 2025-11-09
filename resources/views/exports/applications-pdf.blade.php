<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Applications Export</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 10mm;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 9px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 3px solid #3b82f6;
        }
        .header h1 {
            color: #1e40af;
            margin: 0;
            font-size: 22px;
        }
        .header p {
            color: #6b7280;
            margin: 5px 0;
        }
        .summary {
            background-color: #f3f4f6;
            padding: 12px;
            margin-bottom: 15px;
            border-radius: 5px;
        }
        .summary-item {
            display: inline-block;
            margin-right: 25px;
        }
        .summary-label {
            font-weight: bold;
            color: #4b5563;
        }
        .summary-value {
            color: #1e40af;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 8px;
        }
        th {
            background-color: #3b82f6;
            color: white;
            padding: 6px 3px;
            text-align: left;
            font-weight: bold;
            font-size: 8px;
        }
        td {
            padding: 5px 3px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 7px;
        }
        tr:nth-child(even) {
            background-color: #f9fafb;
        }
        .status-badge {
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 7px;
            font-weight: bold;
            display: inline-block;
        }
        .status-approved {
            background-color: #d1fae5;
            color: #065f46;
        }
        .status-pending {
            background-color: #dbeafe;
            color: #1e40af;
        }
        .status-rejected {
            background-color: #fee2e2;
            color: #991b1b;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 8px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Application Records Export</h1>
        <p>Generated on {{ $exportDate }}</p>
        @if($status !== 'all')
            <p>Filter: <strong>{{ ucfirst($status) }}</strong> Applications</p>
        @endif
    </div>

    <div class="summary">
        <div class="summary-item">
            <span class="summary-label">Total Applications:</span>
            <span class="summary-value">{{ $totalApplications }}</span>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Applicant</th>
                <th>Corporation</th>
                <th>Project Type</th>
                <th>Location</th>
                <th>Lot Area</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Submitted</th>
            </tr>
        </thead>
        <tbody>
            @foreach($applications as $app)
            <tr>
                <td>#{{ $app->id }}</td>
                <td>
                    <strong>{{ $app->applicant_name }}</strong><br>
                    <small style="color: #6b7280;">{{ $app->email_address }}</small>
                </td>
                <td>{{ $app->corporation_name ?? 'N/A' }}</td>
                <td>{{ $app->project_type ?? 'N/A' }}</td>
                <td>{{ Str::limit($app->project_location ?? 'N/A', 30) }}</td>
                <td>{{ $app->lot_area ? number_format($app->lot_area) . ' sqm' : 'N/A' }}</td>
                <td>{{ $app->project_cost ?? 'N/A' }}</td>
                <td>
                    <span class="status-badge status-{{ strtolower($app->current_status ?? 'pending') }}">
                        {{ ucfirst($app->current_status ?? 'pending') }}
                    </span>
                </td>
                <td>{{ $app->submission_date ?? 'N/A' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>This is a computer-generated document. No signature is required.</p>
        <p>© {{ date('Y') }} - Application Management System</p>
    </div>
</body>
</html>

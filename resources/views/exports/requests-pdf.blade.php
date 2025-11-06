<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Requests Export</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
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
            font-size: 9px;
        }
        th {
            background-color: #3b82f6;
            color: white;
            padding: 8px 4px;
            text-align: left;
            font-weight: bold;
            font-size: 9px;
        }
        td {
            padding: 6px 4px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 8px;
        }
        tr:nth-child(even) {
            background-color: #f9fafb;
        }
        .status-badge {
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 8px;
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
            font-size: 9px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Request Records Export</h1>
        <p>Generated on {{ $exportDate }}</p>
        @if($status !== 'all')
            <p>Filter: <strong>{{ ucfirst($status) }}</strong> Requests</p>
        @endif
    </div>

    <div class="summary">
        <div class="summary-item">
            <span class="summary-label">Total Requests:</span>
            <span class="summary-value">{{ $totalRequests }}</span>
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
            @foreach($requests as $req)
            <tr>
                <td>#{{ $req->id }}</td>
                <td>
                    <strong>{{ $req->applicant_name }}</strong><br>
                    <small style="color: #6b7280;">{{ $req->user_email }}</small>
                </td>
                <td>{{ $req->corporation_name ?? 'N/A' }}</td>
                <td>{{ $req->project_type ?? 'N/A' }}</td>
                <td>
                    {{ $req->project_location_barangay ?? '' }}
                    {{ $req->project_location_city ?? '' }}
                    {{ $req->project_location_municipality ?? '' }}
                </td>
                <td>{{ $req->lot_area_sqm ? number_format($req->lot_area_sqm) . ' sqm' : 'N/A' }}</td>
                <td>{{ $req->project_cost ? '₱' . number_format($req->project_cost, 2) : 'N/A' }}</td>
                <td>
                    <span class="status-badge status-{{ strtolower($req->status ?? 'pending') }}">
                        {{ ucfirst($req->status ?? 'pending') }}
                    </span>
                </td>
                <td>{{ $req->created_at ? \Carbon\Carbon::parse($req->created_at)->format('M j, Y') : 'N/A' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>This is a computer-generated document. No signature is required.</p>
        <p>© {{ date('Y') }} - Request Management System</p>
    </div>
</body>
</html>

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CalendarDays,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Search,
  Eye,
  Mail,
  Building2,
  TrendingUp,
  BarChart3,
  MoreVertical,
  Edit,
  ThumbsUp,
  ThumbsDown,
  Trash2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useForm, router } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';

export function AdminDashboard({ applications = [], stats = {} }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: quickData, setData: setQuickData, post, processing, reset } = useForm({
    evaluation: '',
    issued_by: 'Admin',
  });
  
  const { data: editData, setData: setEditData, post: postEdit, processing: editProcessing } = useForm({
    evaluation: '',
    description: '',
    amount: '',
    date_certified: '',
    issued_by: '',
  });

  const handleAction = (app, action) => {
    if (!app.report_id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No report found for this application.",
      });
      return;
    }

    router.post(route('admin.update-evaluation', app.report_id), {
      evaluation: action,
      issued_by: 'Admin',
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Success!",
          description: `Application ${action} successfully!`,
        });
      },
      onError: (errors) => {
        console.error('Update error:', errors);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update application status.",
        });
      }
    });
  };

  const handleEdit = (app) => {
    setSelectedApp(app);
    setEditData({
      evaluation: app.evaluation || app.status || 'pending',
      description: app.report_description || app.project_nature || '',
      amount: app.report_amount || app.project_cost || '',
      date_certified: app.date_certified || '',
      issued_by: app.issued_by || '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedApp.report_id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No report found for this application.",
      });
      return;
    }

    router.post(route('admin.update-evaluation', selectedApp.report_id), editData, {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Success!",
          description: "Application updated successfully!",
        });
        setIsEditModalOpen(false);
      },
      onError: (errors) => {
        console.error('Update error:', errors);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update application.",
        });
      }
    });
  };

  const handleDelete = (app) => {
    if (!confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
      return;
    }

    router.delete(route('admin.delete-request', app.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Success!",
          description: "Request deleted successfully!",
        });
      },
      onError: (errors) => {
        console.error('Delete error:', errors);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete request.",
        });
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-300';
      case 'rejected':
        return 'bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-300';
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLocation = (app) => {
    const parts = [
      app?.project_location_street,
      app?.project_location_barangay,
      app?.project_location_city || app?.project_location_municipality,
      app?.project_location_province
    ].filter(Boolean);
    return parts.join(', ') || 'Location not specified';
  };

  const filteredApplications = useMemo(() => {
    let filtered = applications;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.project_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id?.toString().includes(searchTerm)
      );
    }

    return filtered;
  }, [applications, filterStatus, searchTerm]);

  // Pie chart data
  const pieChartData = [
    { name: 'Pending', value: stats.pending || 0, color: '#3b82f6' },
    { name: 'Approved', value: stats.approved || 0, color: '#10b981' },
    { name: 'Rejected', value: stats.rejected || 0, color: '#ef4444' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-purple-50" onClick={() => setFilterStatus('all')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Total Applications</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">{stats.total || 0}</div>
            <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              All submissions
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-amber-500 bg-gradient-to-br from-white to-amber-50" onClick={() => setFilterStatus('pending')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-900">Pending</CardTitle>
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700">{stats.pending || 0}</div>
            <p className="text-xs text-amber-600 mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50" onClick={() => setFilterStatus('approved')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900">Approved</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700">{stats.approved || 0}</div>
            <p className="text-xs text-emerald-600 mt-1">Successfully processed</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-rose-500 bg-gradient-to-br from-white to-rose-50" onClick={() => setFilterStatus('rejected')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-900">Rejected</CardTitle>
            <div className="p-2 bg-rose-100 rounded-lg">
              <XCircle className="h-5 w-5 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-700">{stats.rejected || 0}</div>
            <p className="text-xs text-rose-600 mt-1">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Evaluation Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Pending Rate</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="font-medium">Approval Rate</span>
              </div>
              <span className="text-2xl font-bold text-emerald-600">
                {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-rose-600" />
                <span className="font-medium">Rejection Rate</span>
              </div>
              <span className="text-2xl font-bold text-rose-600">
                {stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Applications ({filteredApplications.length})
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              {filterStatus !== 'all' && (
                <Button variant="outline" onClick={() => setFilterStatus('all')}>
                  Clear Filter
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">ID</th>
                  <th className="text-left p-3 font-semibold">Applicant</th>
                  <th className="text-left p-3 font-semibold">User</th>
                  <th className="text-left p-3 font-semibold">Project Type</th>
                  <th className="text-left p-3 font-semibold">Date</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.slice(0, 10).map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-sm">#{app.id}</td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{app.applicant_name}</p>
                        {app.corporation_name && (
                          <p className="text-xs text-gray-500">{app.corporation_name}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-sm font-medium">{app.user_name}</p>
                        <p className="text-xs text-gray-500">{app.user_email}</p>
                      </div>
                    </td>
                    <td className="p-3 text-sm">{app.project_type || 'N/A'}</td>
                    <td className="p-3 text-sm">{formatDate(app.created_at)}</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(app.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(app.status)}
                          {(app.status || 'pending').charAt(0).toUpperCase() + (app.status || 'pending').slice(1)}
                        </span>
                      </Badge>
                    </td>
                    <td className="p-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedApp(app);
                              setIsModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(app)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleAction(app, 'approved')}
                            disabled={processing || app.status === 'approved'}
                            className="text-emerald-600"
                          >
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Accept
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction(app, 'rejected')}
                            disabled={processing || app.status === 'rejected'}
                            className="text-rose-600"
                          >
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            Decline
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(app)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details #{selectedApp?.id}</DialogTitle>
            <DialogDescription>
              Submitted on {formatDate(selectedApp?.created_at)}
            </DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  User Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{selectedApp.user_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {selectedApp.user_email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Applicant Info */}
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <h3 className="font-semibold text-emerald-900 mb-3">Applicant Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Applicant Name</p>
                    <p className="font-medium">{selectedApp.applicant_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Corporation</p>
                    <p className="font-medium">{selectedApp.corporation_name || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Address</p>
                    <p className="font-medium">{selectedApp.applicant_address}</p>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Project Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Project Type</p>
                    <p className="font-medium">{selectedApp.project_type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Project Nature</p>
                    <p className="font-medium">{selectedApp.project_nature || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Location
                    </p>
                    <p className="font-medium">{formatLocation(selectedApp)}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Current Status</p>
                  <Badge className={`${getStatusColor(selectedApp.status)} mt-1`}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(selectedApp.status)}
                      {(selectedApp.status || 'pending').charAt(0).toUpperCase() + (selectedApp.status || 'pending').slice(1)}
                    </span>
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="font-medium flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {formatDate(selectedApp.created_at)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Application #{selectedApp?.id}</DialogTitle>
            <DialogDescription>
              Update the evaluation and report details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Evaluation Status</label>
              <select
                value={editData.evaluation}
                onChange={(e) => setEditData('evaluation', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData('description', e.target.value)}
                className="w-full p-2 border rounded-md"
                rows="3"
                placeholder="Enter description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={editData.amount}
                  onChange={(e) => setEditData('amount', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Certified</label>
                <input
                  type="date"
                  value={editData.date_certified}
                  onChange={(e) => setEditData('date_certified', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Issued By</label>
              <input
                type="text"
                value={editData.issued_by}
                onChange={(e) => setEditData('issued_by', e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter issuer name"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={editProcessing}>
                {editProcessing ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Head } from '@inertiajs/react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  CheckCircle2, 
  XCircle, 
  Clock,
  Search,
  Eye,
  MapPin,
  User,
  FileText,
  Download
} from "lucide-react";

export default function Applications({ applications = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const filteredApplications = applications.filter(app => 
    app.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.project_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.id?.toString().includes(searchTerm)
  );

  return (
    <SidebarProvider>
      <Head title="Applications - Admin" />
      <AdminSidebar />
      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Applications</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
             style={{
               backgroundImage: `
                 radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                 radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
                 radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
               `
             }}>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-700">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  All Applications ({filteredApplications.length})
                </CardTitle>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => window.open(route('admin.export.applications', { format: 'pdf' }), '_blank')}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                    <Input
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">ID</th>
                      <th className="text-left p-3 font-semibold">Applicant</th>
                      <th className="text-left p-3 font-semibold">User Email</th>
                      <th className="text-left p-3 font-semibold">Project Type</th>
                      <th className="text-left p-3 font-semibold">Location</th>
                      <th className="text-left p-3 font-semibold">Date</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-mono text-sm">#{app.id}</td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{app.applicant_name}</p>
                            <p className="text-xs text-gray-500">{app.user_name}</p>
                          </div>
                        </td>
                        <td className="p-3 text-sm">{app.user_email}</td>
                        <td className="p-3 text-sm">{app.project_type || 'N/A'}</td>
                        <td className="p-3 text-sm max-w-xs truncate">{formatLocation(app)}</td>
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedApp(app);
                              setIsModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

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
                    <p className="font-medium">{selectedApp.user_email}</p>
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
                  <MapPin className="h-4 w-4" />
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
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium">{formatLocation(selectedApp)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Lot Area</p>
                    <p className="font-medium">{selectedApp.lot_area_sqm ? `${parseFloat(selectedApp.lot_area_sqm).toLocaleString()} sqm` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Project Cost</p>
                    <p className="font-medium">{selectedApp.project_cost ? `₱${parseFloat(selectedApp.project_cost).toLocaleString()}` : 'N/A'}</p>
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
                {selectedApp.date_certified && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Date Certified</p>
                    <p className="font-medium">{formatDate(selectedApp.date_certified)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

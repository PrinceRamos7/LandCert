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
  FileText
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-gradient-to-br from-purple-50 to-slate-50">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  All Applications ({filteredApplications.length})
                </CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
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

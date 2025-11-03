import { AdminSidebar } from "@/components/admin-sidebar";
import { Head, router } from '@inertiajs/react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2, Search, Download } from "lucide-react";
import { useState, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NotificationModal } from "@/Components/ui/notification-modal";

export default function Users({ users }) {
  const [editingUser, setEditingUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationModal, setNotificationModal] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    buttonText: "Continue"
  });

  const usersData = users?.data || users;
  
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return usersData;
    
    return usersData.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.contact_number?.includes(searchTerm) ||
      user.id?.toString().includes(searchTerm)
    );
  }, [usersData, searchTerm]);
  
  const handlePageChange = (url) => {
    if (url) {
      router.get(url, {}, { preserveState: true, preserveScroll: true });
    }
  };
  
  const renderPaginationLinks = () => {
    if (!users?.links || users.links.length <= 3) return null;
    
    return (
      <Pagination className="mt-6">
        <PaginationContent>
          {users.links.map((link, index) => {
            if (index === 0) {
              return (
                <PaginationItem key={index}>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(link.url)}
                    className={!link.url ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              );
            }
            
            if (index === users.links.length - 1) {
              return (
                <PaginationItem key={index}>
                  <PaginationNext 
                    onClick={() => handlePageChange(link.url)}
                    className={!link.url ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              );
            }
            
            if (link.label === '...') {
              return (
                <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            
            return (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => handlePageChange(link.url)}
                  isActive={link.active}
                  className="cursor-pointer"
                >
                  {link.label}
                </PaginationLink>
              </PaginationItem>
            );
          })}
        </PaginationContent>
      </Pagination>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      router.delete(route('admin.users.delete', userToDelete.id), {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setUserToDelete(null);
          setNotificationModal({
            isOpen: true,
            type: "success",
            title: "User Deleted!",
            message: `User "${userToDelete.name}" has been permanently deleted from the system.`,
            buttonText: "Continue"
          });
        },
        onError: () => {
          setIsDeleteDialogOpen(false);
          setNotificationModal({
            isOpen: true,
            type: "error",
            title: "Delete Failed!",
            message: "Failed to delete the user. Please try again or contact support if the problem persists.",
            buttonText: "Try Again"
          });
        }
      });
    }
  };

  const saveEdit = () => {
    if (editingUser) {
      // Basic validation
      if (!editingUser.name?.trim() || !editingUser.email?.trim()) {
        setNotificationModal({
          isOpen: true,
          type: "warning",
          title: "Required Fields Missing",
          message: "Please fill in both name and email fields before saving.",
          buttonText: "OK"
        });
        return;
      }

      router.put(route('admin.users.update', editingUser.id), {
        name: editingUser.name,
        email: editingUser.email,
        contact_number: editingUser.contact_number,
        address: editingUser.address,
      }, {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setEditingUser(null);
          setNotificationModal({
            isOpen: true,
            type: "success",
            title: "User Updated!",
            message: `User "${editingUser.name}" has been updated successfully.`,
            buttonText: "Continue"
          });
        },
        onError: () => {
          setIsEditDialogOpen(false);
          setNotificationModal({
            isOpen: true,
            type: "error",
            title: "Update Failed!",
            message: "Failed to update the user information. Please check the data and try again.",
            buttonText: "Try Again"
          });
        }
      });
    }
  };

  return (
    <SidebarProvider>
      <Head title="Users - Admin" />
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
                  <BreadcrumbPage>User Management</BreadcrumbPage>
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
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Search className="h-6 w-6" />
                    </div>
                    Applicant Users
                  </CardTitle>
                  <p className="text-white/80 mt-2">
                    Total: {users?.total || usersData.length} applicants
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => window.open(route('admin.export.users'), '_blank')}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Contact Number</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>User Type</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          {searchTerm ? 'No users match your search' : 'No applicants found'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <TableRow 
                          key={user.id} 
                          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <TableCell className="font-medium">{user.id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.contact_number || 'N/A'}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {user.address || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{user.user_type}</Badge>
                          </TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(user)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(user)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {renderPaginationLinks()}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={editingUser.contact_number || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, contact_number: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={editingUser.address || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notificationModal.isOpen}
        onClose={() => setNotificationModal(prev => ({ ...prev, isOpen: false }))}
        type={notificationModal.type}
        title={notificationModal.title}
        message={notificationModal.message}
        buttonText={notificationModal.buttonText}
      />
    </SidebarProvider>
  );
}

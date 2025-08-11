"use client";

import { useState, useEffect } from "react";
import { 
  UserReadDTO, 
  UserCreateDTO, 
  UserUpdateDTO
} from "@/lib/user";
import {
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  simpleListUser
} from "./server";
import { DataTable } from "@/components/data-table/data-table";
import { getUserColumns } from "@/components/data-table/user-columns";
import { UserForm } from "@/components/user/user-form";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { PlusIcon, LoaderIcon, UsersIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState<UserReadDTO[]>([]);
  const [searchResults, setSearchResults] = useState<UserReadDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserReadDTO | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Cargar usuarios
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      setUsers(response.items || []);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Failed to load users. Please try again.");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar usuarios
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await simpleListUser(searchQuery, 10);
      setSearchResults(results || []);
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Failed to search users");
      setSearchResults([]);
    }
  };

  // Crear o actualizar usuario
  const handleSubmitUser = async (data: UserCreateDTO | UserUpdateDTO) => {
    try {
      if ("id" in data) {
        // Actualización
        await updateUser(data);
        toast.success("User updated successfully");
        setEditingUser(null);
      } else {
        // Creación
        await createUser(data);
        toast.success("User created successfully");
      }
      setIsFormOpen(false);
      loadUsers(); // Recargar la lista
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to save user");
    }
  };

  // Eliminar usuario
  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete);
      toast.success("User deleted successfully");
      loadUsers(); // Recargar la lista
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // Editar usuario
  const handleEditClick = (user: UserReadDTO) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  // Columnas para la tabla
  const columns = getUserColumns({
    onEdit: handleEditClick,
    onDelete: handleDeleteClick,
  });

  // Si está cargando
  if (isLoading && !users.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoaderIcon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si hay un error
  if (error) {
    return (
      <EmptyState
        title="Error"
        description={error}
        isError
        action={{
          label: "Try Again",
          onClick: loadUsers,
        }}
      />
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts in the system.
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingUser(null)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Update the user details below."
                  : "Fill in the details to create a new user."}
              </DialogDescription>
            </DialogHeader>
            <UserForm
              user={editingUser || undefined}
              onSubmit={handleSubmitUser}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="pt-4">
          {users.length === 0 ? (
            <EmptyState
              title="No users found"
              description="No users have been created yet."
              icon={<UsersIcon className="h-6 w-6 text-muted-foreground" />}
              action={{
                label: "Add User",
                onClick: () => setIsFormOpen(true),
              }}
            />
          ) : (
            <DataTable
              columns={columns}
              data={users}
              searchColumn="nickname"
              searchPlaceholder="Search nicknames..."
            />
          )}
        </TabsContent>
        <TabsContent value="search" className="pt-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
              onKeyUp={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {searchResults.length > 0 ? (
            <DataTable columns={columns} data={searchResults} />
          ) : (
            searchQuery && (
              <EmptyState
                title="No results"
                description="No users found matching your search."
                icon={<UsersIcon className="h-6 w-6 text-muted-foreground" />}
              />
            )
          )}
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmación de eliminación */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone and will permanently remove the user from the system."
      />
    </div>
  );
}

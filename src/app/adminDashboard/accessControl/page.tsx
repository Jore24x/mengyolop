// src/app/adminDashboard/accessControl/page.tsx
import prisma from "@/lib/prisma";
import { Shield, Settings2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddRoleDialog, EditRoleDialog } from "./components/RoleDialogs";
import { deleteRole } from "./action";

export default async function AccessControlPage() {
  // Mengambil data nyata (Coba tanpa orderBy jika createdAt belum di-migrate)
  const roles = await prisma.role.findMany();
  const rolesCount = roles.length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">Access Control</h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 font-bold">
              {rolesCount} Total Roles
            </Badge>
          </div>
          <p className="text-muted-foreground italic">Manage team access and module permissions.</p>
        </div>
        <AddRoleDialog />
      </div>

      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-50 text-blue-600">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            <CardTitle className="text-lg font-bold">Role Management</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-lg border border-slate-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold py-4 text-slate-700">Role Name & Description</TableHead>
                  <TableHead className="font-bold text-slate-700">Permissions</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rolesCount > 0 ? (
                  roles.map((role) => (
                    <TableRow key={role.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-blue-700 text-base">{role.name}</span>
                          <span className="text-xs text-muted-foreground italic leading-relaxed">{role.description || "No description provided"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {role.permissions && typeof role.permissions === 'object' && 
                            Object.entries(role.permissions).map(([module, actions]: [string, any]) => {
                              const hasAccess = Object.values(actions).some(v => v === true);
                              return hasAccess ? (
                                <Badge key={module} variant="secondary" className="text-[10px] bg-blue-50 text-blue-600 border-blue-100 uppercase font-bold">
                                  {module}
                                </Badge>
                              ) : null;
                            })
                          }
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <EditRoleDialog role={role} />
                          <form action={async () => { "use server"; await deleteRole(role.id); }}>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-48 text-center text-slate-400">
                      <Shield className="w-10 h-10 mx-auto mb-2 opacity-10" />
                      <p className="text-sm font-medium">No roles available. Create one to start.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
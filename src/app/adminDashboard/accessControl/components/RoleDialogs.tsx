// src/app/adminDashboard/accessControl/components/RoleDialogs.tsx
"use client";

import React, { useState } from "react";
import { Plus, ShieldCheck, Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createRole, updateRole } from "../action";

const modules = ["Dashboard", "Staff", "Venue"];
const actions = ["Read", "Create", "Update", "Delete"];

// --- DIALOG UNTUK TAMBAH ROLE ---
export function AddRoleDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          <Plus className="w-4 h-4" /> Add New Role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form action={async (formData) => { await createRole(formData); setOpen(false); }}>
          <DialogHeader>
            <DialogTitle className="text-xl text-blue-700 font-bold">Create New Role</DialogTitle>
            <DialogDescription>Define role name and set permissions.</DialogDescription>
          </DialogHeader>
          <RoleFormFields />
          <DialogFooter className="border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save Role</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- DIALOG UNTUK EDIT ROLE ---
export function EditRoleDialog({ role }: { role: any }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          <Edit2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form action={async (formData) => { await updateRole(role.id, formData); setOpen(false); }}>
          <DialogHeader>
            <DialogTitle className="text-xl text-blue-700 font-bold">Edit Role: {role.name}</DialogTitle>
          </DialogHeader>
          <RoleFormFields role={role} />
          <DialogFooter className="border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Update Role</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- SUB-KOMPONEN FORM FIELD (REUSABLE) ---
function RoleFormFields({ role }: { role?: any }) {
  const perms = role?.permissions as any;
  return (
    <div className="grid gap-6 py-6 text-slate-900">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label className="font-bold">Role Name</Label>
          <Input name="name" defaultValue={role?.name} required placeholder="e.g. Moderator" className="focus-visible:ring-blue-500" />
        </div>
        <div className="grid gap-2">
          <Label className="font-bold">Description</Label>
          <Textarea name="description" defaultValue={role?.description} placeholder="Describe this role..." className="focus-visible:ring-blue-500 resize-none" rows={3} />
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <Label className="text-blue-700 font-bold flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Permissions</Label>
        {modules.map((m) => (
          <div key={m} className="border rounded-lg p-4 bg-slate-50/50">
            <span className="font-bold text-xs uppercase text-slate-500 mb-3 block">{m}</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {actions.map((a) => (
                <div key={a} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                  <Label className="text-xs cursor-pointer">{a}</Label>
                  <Switch name={`${m}-${a}`} size="sm" defaultChecked={perms?.[m]?.[a.toLowerCase()] === true} className="data-[state=checked]:bg-blue-600" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
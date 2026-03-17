"use client";
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, Plus, Search } from "lucide-react";
import { format } from "date-fns";

interface StaffData {
  id: string;
  name: string;
  email: string;
  status: "joined" | "invited";
  role: string;
  joinDate: string;
}

interface OptionSelect {
  label: string;
  value: string;
}

const statusOptions: OptionSelect[] = [
  { label: "All Status", value: "all" },
  { label: "Joined", value: "joined" },
  { label: "Invited", value: "invited" },
];

export default function StaffManagement() {
  // State Data
  const [staffList, setStaffList] = useState<StaffData[]>([]);
  const [loading, setLoading] = useState(true);

  // State Form
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffRole, setStaffRole] = useState("");

  // State UI
  const [statusFilter, setStatusFilter] = useState<OptionSelect>(statusOptions[0]);
  const [searchQuery, setSearchQuery] = useState("");

  // Ambil data saat komponen dimuat
  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/staff");
      if (res.ok) {
        const data = await res.json();
        setStaffList(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Simpan Staff Baru
  const handleSave = async () => {
    const newStaff: StaffData = {
      id: Math.random().toString(36).substr(2, 9),
      name: staffName,
      email: staffEmail,
      status: "invited", // Sesuai permintaan: status default invited
      role: staffRole,
      joinDate: format(new Date(), "dd MMM yyyy"),
    };

    try {
      const response = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });

      if (response.ok) {
        fetchStaff(); // Refresh data
        setStaffName("");
        setStaffEmail("");
        setStaffRole("");
      }
    } catch (error) {
      alert("Gagal menambahkan staff");
    }
  };

  // Filter Data
  const filteredStaff = staffList.filter((item) => {
    const matchesStatus = statusFilter.value === "all" || item.status === statusFilter.value;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Staff List</h1>
          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">
            {staffList.length} staff
          </span>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600 shadow-sm w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Add Staff
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-106.25">
            <AlertDialogHeader>
              <AlertDialogTitle>Tambah Staff Baru</AlertDialogTitle>
              <AlertDialogDescription>
                Input data staff di sini. Status akan otomatis diatur ke "Invited".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" value={staffName} onChange={(e) => setStaffName(e.target.value)} placeholder="Masukkan nama..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} placeholder="email@contoh.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Posisi / Role</Label>
                <Input id="role" value={staffRole} onChange={(e) => setStaffRole(e.target.value)} placeholder="Contoh: Coach" />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleSave} 
                disabled={!staffName || !staffEmail || !staffRole}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Simpan Staff
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* SEARCH & FILTER */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            className="pl-10 rounded-xl border-gray-200 focus:ring-blue-500/20"
            placeholder="Search Staff Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-40 justify-between rounded-xl">
                {statusFilter.label}
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {statusOptions.map((opt) => (
                <DropdownMenuCheckboxItem
                  key={opt.value}
                  checked={statusFilter.value === opt.value}
                  onCheckedChange={() => setStatusFilter(opt)}
                >
                  {opt.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="" >
                <TableHead className="w-80  ">Profile</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Role</TableHead>
                <TableHead className="">Join Date</TableHead>
                <TableHead className="">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={2} className="text-center py-10">Memuat data...</TableCell></TableRow>
              ) : filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <TableRow key={staff.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 border border-blue-200">
                          {staff.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{staff.name}</p>
                          <p className="text-sm text-gray-500 truncate">{staff.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                        staff.status === "joined" 
                        ? "bg-green-50 text-green-700 border-green-100" 
                        : "bg-orange-50 text-orange-700 border-orange-100"
                      }`}>
                        {/* {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)} */}
                        {staff.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600 font-medium">{staff.role}</TableCell>
                    <TableCell className="text-gray-500">{staff.joinDate}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5}  className="text-center py-10 text-gray-400 justify-center  ">No staff found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t bg-gray-50/30 text-xs text-gray-400 text-center">
          Showing {filteredStaff.length} of {staffList.length} staff members
        </div>
      </div>
    </div>
  );
}
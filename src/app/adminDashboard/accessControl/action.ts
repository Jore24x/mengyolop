// src/app/adminDashboard/accessControl/action.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Fungsi pembantu untuk memproses FormData menjadi JSON Permission
 */
const getPermissionMatrix = (formData: FormData) => {
  const modules = ["Dashboard", "Staff", "Venue"];
  const actions = ["Read", "Create", "Update", "Delete"];
  const matrix: Record<string, Record<string, boolean>> = {};

  modules.forEach((module) => {
    matrix[module] = {};
    actions.forEach((action) => {
      const value = formData.get(`${module}-${action}`);
      matrix[module][action.toLowerCase()] = value === "on";
    });
  });
  return matrix;
};

export async function createRole(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const permissions = getPermissionMatrix(formData);

  try {
    await prisma.role.create({
      data: {
        name,
        description,
        permissions,
        status: "ACTIVE",
      },
    });
    revalidatePath("/adminDashboard/accessControl");
    return { success: true };
  } catch (error) {
    console.error("Create Error:", error);
    return { success: false };
  }
}

export async function updateRole(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const permissions = getPermissionMatrix(formData);

  try {
    await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
        permissions,
      },
    });
    revalidatePath("/adminDashboard/accessControl");
    return { success: true };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false };
  }
}

export async function deleteRole(id: string) {
  try {
    await prisma.role.delete({ where: { id } });
    revalidatePath("/adminDashboard/accessControl");
  } catch (error) {
    console.error("Delete Error:", error);
  }
}
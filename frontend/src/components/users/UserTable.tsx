"use client";

import { Trash2, Users as UsersIcon } from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import Tooltip from "@/components/ui/Tooltip";
import type { Role, User } from "@/types/auth";

interface UserTableProps {
  users: User[];
  roles: Role[];
  onRoleChange: (user: User, roleId: number) => void;
  onToggleStatus: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({
  users,
  roles,
  onRoleChange,
  onToggleStatus,
  onDelete,
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
        <UsersIcon className="h-10 w-10" />
        <p className="text-sm">No users found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <th className="whitespace-nowrap px-4 py-3 font-medium">User</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Role</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Status</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {users.map((user) => (
            <tr key={user.id} className="text-slate-700 dark:text-slate-200">
              <td className="whitespace-nowrap px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={user.full_name} />
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">
                      {user.full_name}
                    </p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
              </td>

              <td className="whitespace-nowrap px-4 py-3">
                <Select
                  value={user.role.id}
                  onChange={(e) => onRoleChange(user, Number(e.target.value))}
                  className="min-w-[10rem]"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.display_name}
                    </option>
                  ))}
                </Select>
              </td>

              <td className="whitespace-nowrap px-4 py-3">
                <button
                  type="button"
                  onClick={() => onToggleStatus(user)}
                  className="cursor-pointer"
                >
                  <Badge variant={user.is_active ? "success" : "danger"}>
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                </button>
              </td>

              <td className="whitespace-nowrap px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Tooltip label="Delete">
                    <button
                      type="button"
                      onClick={() => onDelete(user)}
                      aria-label="Delete user"
                      className="rounded-lg p-2 cursor-pointer text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </Tooltip>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

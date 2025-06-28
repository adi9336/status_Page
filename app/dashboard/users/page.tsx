"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaUser, FaEdit, FaSave, FaTimes, FaUserShield, FaUserCheck, FaUserSlash } from "react-icons/fa";

interface User {
  id: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  timezone?: string;
  language?: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  profileCompleted: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const startEditing = (user: User) => {
    setEditingUserId(user.id);
    setEditForm({ ...user });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditForm({});
  };

  const saveUser = async (userId: string) => {
    setLoading(true);
    await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingUserId(null);
    setEditForm({});
    fetchUsers();
    setLoading(false);
  };

  const deactivateUser = async (userId: string) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return;
    setLoading(true);
    await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    });
    fetchUsers();
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-block bg-white hover:bg-blue-50 text-blue-600 font-semibold px-4 py-2 rounded-full transition-colors text-sm shadow border border-gray-200">
          ← Return to Dashboard
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaUser className="text-blue-400" /> User Management
        </h1>
        <p className="text-gray-500 text-base mt-1">Manage your team members, roles, and access</p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Team Members</h2>
        {loading ? (
          <div className="text-center text-gray-400 py-8">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                          <FaUser />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{user.fullName || user.firstName || user.email}</div>
                        <div className="text-xs text-gray-400">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                    <td className="px-4 py-3 text-sm">
                      {editingUserId === user.id ? (
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="SUPER_ADMIN">Super Admin</option>
                          <option value="ADMIN">Admin</option>
                          <option value="MANAGER">Manager</option>
                          <option value="MEMBER">Member</option>
                          <option value="VIEWER">Viewer</option>
                        </select>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          {user.role === "SUPER_ADMIN" && <FaUserShield className="text-blue-500" />}
                          {user.role === "ADMIN" && <FaUserShield className="text-green-500" />}
                          {user.role === "MANAGER" && <FaUserCheck className="text-yellow-500" />}
                          {user.role === "MEMBER" && <FaUser className="text-gray-500" />}
                          {user.role === "VIEWER" && <FaUserSlash className="text-gray-400" />}
                          {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user.isActive ? (
                        <span className="inline-block px-2 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">Active</span>
                      ) : (
                        <span className="inline-block px-2 py-1 rounded-full bg-gray-200 text-gray-500 text-xs font-semibold">Inactive</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm flex gap-2 items-center">
                      {editingUserId === user.id ? (
                        <>
                          <button
                            onClick={() => saveUser(user.id)}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Save"
                          >
                            <FaSave className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-gray-600 hover:text-gray-800 p-1"
                            title="Cancel"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(user)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          {user.isActive && (
                            <button
                              onClick={() => deactivateUser(user.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Deactivate"
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 
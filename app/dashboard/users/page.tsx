"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaUser, FaEdit, FaSave, FaTimes, FaUserShield, FaUserCheck, FaUserSlash, FaSearch, FaFilter, FaPlus } from "react-icons/fa";
import Image from 'next/image';

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
  lastLoginAt?: string;
  lastActivityAt?: string;
  lastIncidentCreatedAt?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "MEMBER",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Role filter
    if (roleFilter !== "ALL") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(user => 
        statusFilter === "ACTIVE" ? user.isActive : !user.isActive
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

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
    try {
      await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      setEditingUserId(null);
      setEditForm({});
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
    setLoading(false);
  };

  const deactivateUser = async (userId: string) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return;
    setLoading(true);
    try {
      await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to deactivate user:", error);
    }
    setLoading(false);
  };

  const createUser = async () => {
    if (!createForm.email) {
      alert("Email is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `user_${Date.now()}`, // Generate a temporary ID
          email: createForm.email,
          firstName: createForm.firstName,
          lastName: createForm.lastName,
          organizationId: "org_2z6AucumjhZE4b008K1hvAresjG", // Your org ID
          role: createForm.role,
        }),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setCreateForm({ email: "", firstName: "", lastName: "", role: "MEMBER" });
        fetchUsers();
      } else {
        const error = await response.json();
        alert(`Failed to create user: ${error.error}`);
      }
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Failed to create user");
    }
    setLoading(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN": return <FaUserShield className="text-purple-500" />;
      case "ADMIN": return <FaUserShield className="text-green-500" />;
      case "MANAGER": return <FaUserCheck className="text-yellow-500" />;
      case "MEMBER": return <FaUser className="text-blue-500" />;
      case "VIEWER": return <FaUserSlash className="text-gray-400" />;
      default: return <FaUser className="text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN": return "bg-purple-100 text-purple-700";
      case "ADMIN": return "bg-green-100 text-green-700";
      case "MANAGER": return "bg-yellow-100 text-yellow-700";
      case "MEMBER": return "bg-blue-100 text-blue-700";
      case "VIEWER": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
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
        <p className="text-gray-500 text-base mt-1">Manage your team members, roles, and access permissions</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="MEMBER">Member</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Create User Button */}
          <div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FaPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Team Members ({filteredUsers.length})</h2>
          <div className="text-sm text-gray-500">
            {users.filter(u => u.isActive).length} active, {users.filter(u => !u.isActive).length} inactive
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-8">Loading...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            {users.length === 0 ? "No users found. Add users through your authentication system." : "No users match your search criteria."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 flex items-center gap-3">
                      {user.avatar ? (
                        <Image src={user.avatar} alt="avatar" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                          <FaUser />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}
                        </div>
                        <div className="text-xs text-gray-400">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">{user.email}</td>
                    <td className="px-4 py-4 text-sm">
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
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {user.role.charAt(0) + user.role.slice(1).toLowerCase().replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {user.isActive ? (
                        <span className="inline-block px-2 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">Active</span>
                      ) : (
                        <span className="inline-block px-2 py-1 rounded-full bg-gray-200 text-gray-500 text-xs font-semibold">Inactive</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {user.lastActivityAt ? new Date(user.lastActivityAt).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-4 py-4 text-sm flex gap-2 items-center">
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

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add New User</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="user@example.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={createForm.firstName}
                    onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={createForm.lastName}
                    onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="MEMBER">Member</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                  <option value="VIEWER">Viewer</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createUser}
                disabled={loading || !createForm.email}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  clerkId: string;
}

interface MasterAdminPanelProps {
  onClose: () => void;
}

export default function MasterAdminPanel({ onClose }: MasterAdminPanelProps) {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'MEMBER',
    clerkId: ''
  });

  // Check if current user is master admin
  useEffect(() => {
    const checkMasterAdmin = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/users/master-admin');
        if (response.ok) {
          setIsMasterAdmin(true);
          const data = await response.json();
          setUsers(data);
        } else {
          setIsMasterAdmin(false);
          toast.error('Access denied. Master admin privileges required.');
        }
      } catch (error) {
        console.error('Error checking master admin status:', error);
        setIsMasterAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkMasterAdmin();
  }, [user]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.email) {
      toast.error('Email is required');
      return;
    }

    try {
      const response = await fetch('/api/users/master-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const createdUser = await response.json();
        setUsers([createdUser, ...users]);
        setNewUser({
          email: '',
          firstName: '',
          lastName: '',
          role: 'MEMBER',
          clerkId: ''
        });
        toast.success('User created successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const response = await fetch('/api/users/master-admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          users: [{ id: userId, ...updates }]
        }),
      });

      if (response.ok) {
        const updatedUsers = await response.json();
        setUsers(users.map(user => 
          user.id === userId ? updatedUsers[0] : user
        ));
        toast.success('User updated successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    await handleUpdateUser(userId, { isActive });
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    await handleUpdateUser(userId, { role });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-center">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isMasterAdmin) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have master admin privileges to access this panel.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Master Admin Panel</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mt-2">Manage all users in the organization</p>
        </div>

        <div className="p-6">
          {/* Create New User Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New User</h3>
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="email"
                placeholder="Email *"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="First Name"
                value={newUser.firstName}
                onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newUser.lastName}
                onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="border rounded px-3 py-2"
              >
                <option value="MEMBER">Member</option>
                <option value="VIEWER">Viewer</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
              <input
                type="text"
                placeholder="Clerk ID (optional)"
                value={newUser.clerkId}
                onChange={(e) => setNewUser({...newUser, clerkId: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Create User
              </button>
            </form>
          </div>

          {/* Users List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Manage Users</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Created</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="px-4 py-2">
                        {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}
                      </td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                          disabled={user.role === 'MASTER_ADMIN'}
                        >
                          <option value="VIEWER">Viewer</option>
                          <option value="MEMBER">Member</option>
                          <option value="MANAGER">Manager</option>
                          <option value="ADMIN">Admin</option>
                          <option value="SUPER_ADMIN">Super Admin</option>
                          <option value="MASTER_ADMIN">Master Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleToggleUserStatus(user.id, !user.isActive)}
                          className={`px-2 py-1 rounded text-xs ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                          disabled={user.role === 'MASTER_ADMIN'}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-xs text-gray-500">
                          {user.role === 'MASTER_ADMIN' ? 'Protected' : 'Editable'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
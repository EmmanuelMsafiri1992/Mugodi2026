import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit, Trash2, X, User, Shield, ShieldOff, Mail, Phone, Download, UserPlus, RefreshCw, Eye } from 'lucide-react';
import useAdminStore from '../../store/adminStore';
import useAuthStore from '../../store/authStore';
import Pagination from '../../components/admin/Pagination';
import toast from 'react-hot-toast';

const Users = () => {
  const navigate = useNavigate();
  const {
    users,
    totalUsers,
    isLoadingUsers,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  } = useAdminStore();
  const { impersonateUser } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    isActive: true
  });
  const [isCreating, setIsCreating] = useState(false);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers({ search: searchQuery, role: roleFilter, page });
  };

  const exportUsers = () => {
    const headers = ['Name', 'Email', 'Phone', 'Role', 'Status', 'Wallet Balance', 'Loyalty Points', 'Joined'];
    const rows = users.map(u => [
      u.name,
      u.email,
      u.phone || '-',
      u.role,
      u.isActive !== false ? 'Active' : 'Inactive',
      u.walletBalance || 0,
      u.loyaltyPoints || 0,
      formatDate(u.createdAt)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Users exported successfully');
  };

  const handleRefresh = () => {
    fetchUsers({ search: searchQuery, role: roleFilter, page: currentPage });
    toast.success('Users refreshed');
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers({ search: searchQuery, role: roleFilter, page: 1 });
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user',
      isActive: user.isActive !== false,
      walletBalance: user.walletBalance?.toString() || '0',
      loyaltyPoints: user.loyaltyPoints?.toString() || '0'
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(selectedUser._id, {
        ...editFormData,
        walletBalance: parseFloat(editFormData.walletBalance),
        loyaltyPoints: parseInt(editFormData.loyaltyPoints)
      });
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!createFormData.name || !createFormData.email) {
      toast.error('Name and email are required');
      return;
    }
    setIsCreating(true);
    try {
      await createUser(createFormData);
      setShowCreateModal(false);
      setCreateFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'user',
        isActive: true
      });
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleImpersonate = async (user) => {
    if (user.role === 'admin') {
      toast.error('Cannot impersonate admin users');
      return;
    }

    if (window.confirm(`Are you sure you want to view the site as ${user.name}? You will be redirected to the homepage.`)) {
      setIsImpersonating(true);
      try {
        const result = await impersonateUser(user._id);
        if (result.success) {
          toast.success(result.message);
          // Redirect to home page as the impersonated user
          navigate('/');
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Failed to impersonate user');
      } finally {
        setIsImpersonating(false);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-MW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500">{totalUsers} users total</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={exportUsers}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="team">Team Members</option>
            <option value="admin">Admins</option>
          </select>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Search
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoadingUsers ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wallet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.loyaltyPoints || 0} points</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : user.role === 'team'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {user.role === 'team' ? 'Team' : user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      MWK {(user.walletBalance || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleImpersonate(user)}
                            disabled={isImpersonating}
                            className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg"
                            title="Login as this user"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-lg"
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 text-gray-600 hover:text-red-500 hover:bg-gray-100 rounded-lg"
                          disabled={user.role === 'admin'}
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalUsers}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Edit User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Edit User</h2>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="user">User</option>
                    <option value="team">Team Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editFormData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.value === 'active' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Balance (MWK)</label>
                  <input
                    type="number"
                    value={editFormData.walletBalance}
                    onChange={(e) => setEditFormData({ ...editFormData, walletBalance: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loyalty Points</label>
                  <input
                    type="number"
                    value={editFormData.loyaltyPoints}
                    onChange={(e) => setEditFormData({ ...editFormData, loyaltyPoints: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Add New User</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={createFormData.phone}
                  onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
                  placeholder="+265 999 123 456"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={createFormData.password}
                  onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                  placeholder="Leave empty for default: Mugodi@123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">Default password: Mugodi@123</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={createFormData.role}
                    onChange={(e) => setCreateFormData({ ...createFormData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="user">User</option>
                    <option value="team">Team Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={createFormData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setCreateFormData({ ...createFormData, isActive: e.target.value === 'active' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

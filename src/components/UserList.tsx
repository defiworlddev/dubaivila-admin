import { useState, useEffect } from 'react';
import { adminService, AdminUser } from '../service/adminService';

export const UserList = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [approvingIds, setApprovingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const allUsers = await adminService.getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAgent = async (userId: string) => {
    setApprovingIds((prev) => new Set(prev).add(userId));
    try {
      const updatedUser = await adminService.approveAgent(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? updatedUser : user))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve agent');
      console.error('Failed to approve agent:', err);
    } finally {
      setApprovingIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-primary-600 font-medium">Loading users...</div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary-900">All Users</h2>
        <button
          onClick={loadUsers}
          className="bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-primary-200 p-12 text-center">
          <p className="text-primary-700 font-medium">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-primary-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-50 border-b border-primary-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-primary-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-primary-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-primary-900">
                        {user.name || 'No name'}
                      </div>
                      {user.isNewUser && (
                        <div className="text-xs text-primary-500 mt-1">New User</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-primary-700">{user.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isAgent ? (
                        <span className="px-2.5 py-1 rounded text-xs font-semibold bg-primary-100 text-primary-800">
                          Agent
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isAgent ? (
                        user.isApproved ? (
                          <span className="px-2.5 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                            Approved
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded text-xs font-semibold bg-accent-100 text-accent-800">
                            Pending Approval
                          </span>
                        )
                      ) : (
                        <span className="px-2.5 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-600">
                          N/A
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isAgent && !user.isApproved && (
                        <button
                          onClick={() => handleApproveAgent(user.id)}
                          disabled={approvingIds.has(user.id)}
                          className="px-4 py-2 bg-primary-700 text-white rounded-lg text-sm font-semibold hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {approvingIds.has(user.id) ? 'Approving...' : 'Approve'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};


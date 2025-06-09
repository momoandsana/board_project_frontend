
import React, { useEffect, useState, useCallback } from 'react';
import apiService from '../services/apiService';
import { useAuth } from '../hooks/useAuth';
import { AdminUser } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { showToast } from '../components/Toast';

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { basicAuthHeader, user: currentUser } = useAuth();
  
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!basicAuthHeader) {
      setError("Authentication required.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.listUsers(basicAuthHeader);
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users.');
      showToast('error', err.message || 'Failed to fetch users.');
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicAuthHeader]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async () => {
    if (!userToDelete || !basicAuthHeader) return;

    if (userToDelete.username === 'admin') {
      showToast('error', "The 'admin' account cannot be deleted.");
      setUserToDelete(null);
      return;
    }
    if (userToDelete.username === currentUser?.username) {
       showToast('error', "You cannot delete your own account from the admin panel.");
       setUserToDelete(null);
       return;
    }

    setIsDeleting(true);
    try {
      await apiService.deleteUserByAdmin(userToDelete.id, basicAuthHeader);
      showToast('success', `User '${userToDelete.username}' deleted successfully.`);
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
    } catch (err: any) {
      setError(err.message || `Failed to delete user ${userToDelete.username}.`);
      showToast('error', err.message || `Failed to delete user ${userToDelete.username}.`);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading users..." />;
  if (error) return <div className="text-center text-status-danger p-4 bg-status-danger bg-opacity-10 rounded-md">{error}</div>;

  return (
    <div className="bg-neutral-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-neutral-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-neutral-100">Manage Users</h2>
        <Button onClick={fetchUsers} variant="ghost" size="sm" isLoading={isLoading}>
          Refresh List
        </Button>
      </div>
      
      {users.length === 0 ? (
        <p className="text-neutral-400 text-center py-5">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-700">
            <thead className="bg-neutral-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Username</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-neutral-800 divide-y divide-neutral-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-100">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_admin ? 'bg-neutral-700 text-neutral-100' : 'bg-neutral-600 text-neutral-300'}`}>
                      {user.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.username !== 'admin' && user.username !== currentUser?.username && (
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => setUserToDelete(user)}
                        className="text-xs"
                      >
                        Delete
                      </Button>
                    )}
                     {(user.username === 'admin' || user.username === currentUser?.username) && (
                        <span className="text-xs text-neutral-500 italic">N/A</span>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title={`Confirm Delete User: ${userToDelete?.username}`}
      >
        <p>Are you sure you want to delete the user <strong className="text-white">{userToDelete?.username}</strong>? This action cannot be undone.</p>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="ghost" onClick={() => setUserToDelete(null)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser} isLoading={isDeleting}>
            Yes, Delete User
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
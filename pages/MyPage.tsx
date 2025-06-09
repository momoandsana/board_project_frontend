
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { showToast } from '../components/Toast';

const MyPage: React.FC = () => {
  const { user, deleteAccount, isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user) return;
    const success = await deleteAccount();
    setIsModalOpen(false);
    if (success) {
      navigate('/'); 
    }
  };

  if (isLoadingAuth) {
    return <div className="text-center p-10 text-neutral-400">Loading user data...</div>;
  }

  if (!user) {
    // This should ideally be caught by ProtectedRoute, but as a fallback:
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700">
      <h2 className="text-3xl font-bold text-neutral-100 mb-6">My Page</h2>
      <div className="mb-6 p-4 border border-neutral-700 rounded-md bg-neutral-900">
        <p className="text-lg text-neutral-100">
          <strong>Username:</strong> <span className="text-white">{user.username}</span>
        </p>
        <p className="text-lg text-neutral-100">
          <strong>Role:</strong> {user.is_admin ? 'Administrator' : 'User'}
        </p>
      </div>
      
      <div className="mt-8 border-t border-neutral-700 pt-6">
        <h3 className="text-xl font-semibold text-status-danger mb-3">Account Deletion</h3>
        <p className="text-sm text-neutral-400 mb-4">
          Deleting your account is permanent and cannot be undone. All your posts and comments will also be removed.
        </p>
        <Button variant="danger" onClick={() => setIsModalOpen(true)} isLoading={isLoadingAuth}>
          Delete My Account
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Account Deletion"
      >
        <p>Are you sure you want to delete your account? This action is irreversible.</p>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount} isLoading={isLoadingAuth}>
            Yes, Delete My Account
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyPage;
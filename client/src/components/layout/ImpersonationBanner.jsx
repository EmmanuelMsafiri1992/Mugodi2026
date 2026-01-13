import { useNavigate } from 'react-router-dom';
import { Eye, X, ArrowLeft } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const ImpersonationBanner = () => {
  const navigate = useNavigate();
  const { isImpersonating, impersonatedUser, originalAdmin, stopImpersonation, isLoading } = useAuthStore();

  if (!isImpersonating) {
    return null;
  }

  const handleStopImpersonation = async () => {
    const result = await stopImpersonation();
    if (result.success) {
      toast.success(result.message);
      // Navigate back to admin users page
      navigate('/admin/users');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="bg-amber-500 text-amber-950 px-4 py-2 sticky top-0 z-[100]">
      <div className="container-custom flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">
            You are viewing as <strong>{impersonatedUser?.name || 'User'}</strong>
            {impersonatedUser?.email && (
              <span className="text-amber-800 ml-1">({impersonatedUser.email})</span>
            )}
          </span>
        </div>
        <button
          onClick={handleStopImpersonation}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          {isLoading ? 'Returning...' : 'Exit to Admin'}
        </button>
      </div>
    </div>
  );
};

export default ImpersonationBanner;

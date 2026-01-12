import { useState } from 'react';
import { User, Mail, Phone, Award, Wallet, Edit2, Save } from 'lucide-react';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } else {
      toast.error(result.message || 'Failed to update profile');
    }
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
              {!isEditing && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <div className="flex space-x-3">
                  <Button type="submit" isLoading={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ name: user?.name || '', phone: user?.phone || '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Referral Code */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Referral Code</h2>
            <p className="text-gray-600 mb-4">
              Share your referral code with friends and earn rewards when they sign up!
            </p>
            <div className="flex items-center space-x-3">
              <div className="flex-1 p-3 bg-gray-100 rounded-lg font-mono font-bold text-lg text-center">
                {user?.referralCode}
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(user?.referralCode);
                  toast.success('Referral code copied!');
                }}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Wallet className="w-8 h-8" />
              <div>
                <p className="text-primary-100 text-sm">Wallet Balance</p>
                <p className="text-2xl font-bold">MWK {user?.walletBalance?.toLocaleString() || '0'}</p>
              </div>
            </div>
            <a href="/wallet" className="text-sm text-primary-100 hover:text-white">
              View Transactions →
            </a>
          </div>

          <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Award className="w-8 h-8" />
              <div>
                <p className="text-secondary-100 text-sm">Loyalty Points</p>
                <p className="text-2xl font-bold">{user?.loyaltyPoints || 0}</p>
              </div>
            </div>
            <p className="text-sm text-secondary-100">
              Worth MWK {((user?.loyaltyPoints || 0) * 10).toLocaleString()}
            </p>
            <a href="/loyalty" className="text-sm text-secondary-100 hover:text-white block mt-2">
              Convert to Wallet →
            </a>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <p className="text-sm text-gray-500 mb-1">Member Since</p>
            <p className="font-medium">
              {new Date(user?.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface PasswordDialogProps {
  title: string;
  onSubmit: (password: string) => void;
  onCancel: () => void;
  isSettingPassword?: boolean;
}

const PasswordDialog: React.FC<PasswordDialogProps> = ({
  title,
  onSubmit,
  onCancel,
  isSettingPassword = false,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (isSettingPassword) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full overflow-hidden shadow-xl">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Lock className="h-6 w-6 text-purple-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter password"
              />
            </div>
            
            {isSettingPassword && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Confirm password"
                />
              </div>
            )}
            
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 text-right">
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 mr-3 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            onClick={handleSubmit}
          >
            {isSettingPassword ? 'Set Password' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordDialog;
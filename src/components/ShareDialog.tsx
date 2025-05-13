import React, { useState } from 'react';
import { Share2, UserPlus, X } from 'lucide-react';

interface ShareDialogProps {
  onShare: (emails: string[], canEdit: boolean) => void;
  onClose: () => void;
  existingShares?: { email: string; canEdit: boolean }[];
  onRemoveShare?: (email: string) => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  onShare,
  onClose,
  existingShares = [],
  onRemoveShare,
}) => {
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [canEdit, setCanEdit] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddEmail = () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (emails.includes(email)) {
      setError('This email has already been added');
      return;
    }
    setEmails([...emails, email]);
    setEmail('');
    setError('');
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((e) => e !== emailToRemove));
  };

  const handleShare = () => {
    if (emails.length === 0) {
      setError('Please add at least one email address');
      return;
    }
    onShare(emails, canEdit);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full overflow-hidden shadow-xl">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Share2 className="h-6 w-6 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Share Note
            </h3>
          </div>

          {existingShares.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currently shared with:
              </h4>
              <div className="space-y-2">
                {existingShares.map(({ email, canEdit }) => (
                  <div key={email} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <div>
                      <span className="text-sm text-gray-800 dark:text-gray-200">{email}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        ({canEdit ? 'Can edit' : 'Read only'})
                      </span>
                    </div>
                    {onRemoveShare && (
                      <button
                        onClick={() => onRemoveShare(email)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Add people
              </label>
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddEmail();
                  }}
                  className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter email address"
                />
                <button
                  onClick={handleAddEmail}
                  className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  <UserPlus size={20} />
                </button>
              </div>
            </div>

            {emails.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {emails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                  >
                    {email}
                    <button
                      onClick={() => handleRemoveEmail(email)}
                      className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="canEdit"
                checked={canEdit}
                onChange={(e) => setCanEdit(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="canEdit"
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                Allow editing
              </label>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 text-right">
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 mr-3 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleShare}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;
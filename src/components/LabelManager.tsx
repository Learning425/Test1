import React, { useState } from 'react';
import { X, Plus, Pencil, Trash2 } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import ConfirmDialog from './ConfirmDialog';

interface LabelManagerProps {
  onClose: () => void;
  onSelectLabels: (labelIds: string[]) => void;
  selectedLabels?: string[];
}

const LabelManager: React.FC<LabelManagerProps> = ({
  onClose,
  onSelectLabels,
  selectedLabels = [],
}) => {
  const { labels, addLabel, updateLabel, deleteLabel } = useNotes();
  const [newLabelName, setNewLabelName] = useState('');
  const [editLabelId, setEditLabelId] = useState<string | null>(null);
  const [editLabelName, setEditLabelName] = useState('');
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(selectedLabels);
  const [labelToDelete, setLabelToDelete] = useState<string | null>(null);

  const handleAddLabel = () => {
    if (newLabelName.trim()) {
      addLabel(newLabelName.trim());
      setNewLabelName('');
    }
  };

  const handleEditLabel = () => {
    if (editLabelId && editLabelName.trim()) {
      updateLabel(editLabelId, editLabelName.trim());
      setEditLabelId(null);
      setEditLabelName('');
    }
  };

  const handleDeleteLabel = () => {
    if (labelToDelete) {
      deleteLabel(labelToDelete);
      setLabelToDelete(null);
      // Remove from selection if it was selected
      setSelectedLabelIds((prev) => prev.filter((id) => id !== labelToDelete));
    }
  };

  const toggleLabelSelection = (labelId: string) => {
    setSelectedLabelIds((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId]
    );
  };

  const confirmSelection = () => {
    onSelectLabels(selectedLabelIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Manage Labels
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 flex items-center">
          <input
            type="text"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            placeholder="Add new label"
            className="flex-grow border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddLabel();
            }}
          />
          <button
            onClick={handleAddLabel}
            disabled={!newLabelName.trim()}
            className="ml-2 p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4">
          {labels.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No labels yet. Create your first label above.
            </p>
          ) : (
            <ul className="space-y-2">
              {labels.map((label) => (
                <li
                  key={label.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    selectedLabelIds.includes(label.id)
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {editLabelId === label.id ? (
                    <div className="flex-grow flex">
                      <input
                        type="text"
                        value={editLabelName}
                        onChange={(e) => setEditLabelName(e.target.value)}
                        className="flex-grow border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditLabel();
                          if (e.key === 'Escape') {
                            setEditLabelId(null);
                            setEditLabelName('');
                          }
                        }}
                      />
                      <button
                        onClick={handleEditLabel}
                        className="ml-2 p-2 rounded-full bg-green-600 text-white hover:bg-green-700"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: label.color }}
                        />
                        <span
                          className="text-gray-800 dark:text-gray-200 font-medium cursor-pointer"
                          onClick={() => toggleLabelSelection(label.id)}
                        >
                          {label.name}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setEditLabelId(label.id);
                            setEditLabelName(label.name);
                          }}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setLabelToDelete(label.id)}
                          className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {onSelectLabels && (
          <div className="p-4 border-t dark:border-gray-700 flex justify-end">
            <button
              onClick={confirmSelection}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {labelToDelete && (
        <ConfirmDialog
          title="Delete Label"
          message="Are you sure you want to delete this label? This action cannot be undone."
          onConfirm={handleDeleteLabel}
          onCancel={() => setLabelToDelete(null)}
          confirmText="Delete"
          isDestructive
        />
      )}
    </div>
  );
};

export default LabelManager;
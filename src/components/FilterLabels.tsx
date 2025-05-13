import React from 'react';
import { Tag, X } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import LabelPill from './LabelPill';

const FilterLabels: React.FC = () => {
  const { labels, activeLabels, toggleActiveLabel, clearActiveLabels } = useNotes();

  if (labels.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 py-2 px-4">
      <div className="max-w-6xl mx-auto flex items-center">
        <Tag size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
        <div className="text-sm text-gray-500 dark:text-gray-400 mr-3">Filter:</div>
        
        <div className="flex flex-wrap gap-2 items-center">
          {labels.map((label) => (
            <LabelPill
              key={label.id}
              labelId={label.id}
              isActive={activeLabels.includes(label.id)}
              onClick={() => toggleActiveLabel(label.id)}
            />
          ))}
          
          {activeLabels.length > 0 && (
            <button
              onClick={clearActiveLabels}
              className="inline-flex items-center rounded-full px-2.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <X size={14} className="mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterLabels;
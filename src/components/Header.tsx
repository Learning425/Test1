import React from 'react';
import { Search, Grid, List, Plus, Tag } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { debounce } from '../utils/helpers';

interface HeaderProps {
  onNewNote: () => void;
  onManageLabels: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewNote, onManageLabels }) => {
  const { viewMode, setViewMode, setSearchQuery } = useNotes();

  const handleSearchChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, 300);

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm px-4 py-3">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Notes
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={onNewNote}
              className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              aria-label="Create new note"
            >
              <Plus size={20} />
            </button>
            <button
              onClick={onManageLabels}
              className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Manage labels"
            >
              <Tag size={20} />
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search notes..."
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex items-center space-x-1 ml-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid'
                  ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list'
                  ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
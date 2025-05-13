import React, { useState, useMemo } from 'react';
import NoteItem from './NoteItem';
import { useNotes } from '../context/NotesContext';
import ConfirmDialog from './ConfirmDialog';
import { Note } from '../types';
import { stripHtml } from '../utils/helpers';

const NoteList: React.FC<{ onNoteClick: (note: Note) => void }> = ({ onNoteClick }) => {
  const { notes, viewMode, togglePinNote, deleteNote, searchQuery, activeLabels } = useNotes();
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          stripHtml(note.content).toLowerCase().includes(query)
      );
    }

    // Filter by active labels
    if (activeLabels.length > 0) {
      filtered = filtered.filter((note) =>
        activeLabels.every((labelId) => note.labels.includes(labelId))
      );
    }

    return filtered;
  }, [notes, searchQuery, activeLabels]);

  const handleDeleteConfirm = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete);
      setNoteToDelete(null);
    }
  };

  const isGrid = viewMode === 'grid';

  if (filteredNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          No notes found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          {searchQuery || activeLabels.length > 0
            ? "We couldn't find any notes matching your filters. Try changing your search terms or filters."
            : "You don't have any notes yet. Create your first note by clicking the + button."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={`p-4 max-w-6xl mx-auto ${isGrid ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}`}>
        {filteredNotes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            isGrid={isGrid}
            onNoteClick={onNoteClick}
            onPinToggle={togglePinNote}
            onDelete={setNoteToDelete}
          />
        ))}
      </div>
      
      {noteToDelete && (
        <ConfirmDialog
          title="Delete Note"
          message="Are you sure you want to delete this note? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setNoteToDelete(null)}
          confirmText="Delete"
          cancelText="Cancel"
          isDestructive
        />
      )}
    </>
  );
};

export default NoteList;
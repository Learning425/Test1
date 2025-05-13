import React, { useState } from 'react';
import { NotesProvider } from './context/NotesContext';
import Header from './components/Header';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import LabelManager from './components/LabelManager';
import FilterLabels from './components/FilterLabels';
import { Note } from './types';
import AnimatedTransition from './components/AnimatedTransition';

function App() {
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [showLabelManager, setShowLabelManager] = useState(false);
  const [labelManagerMode, setLabelManagerMode] = useState<'manage' | 'select'>('manage');

  const handleNewNote = () => {
    setActiveNote(null);
    setIsCreatingNote(true);
  };

  const handleEditNote = (note: Note) => {
    setActiveNote(note);
    setIsCreatingNote(false);
  };

  const handleCloseEditor = () => {
    setActiveNote(null);
    setIsCreatingNote(false);
  };

  const handleOpenLabelManager = () => {
    setShowLabelManager(true);
    setLabelManagerMode('manage');
  };

  const handleOpenLabelSelector = () => {
    setShowLabelManager(true);
    setLabelManagerMode('select');
  };

  const handleLabelSelection = (labelIds: string[]) => {
    if (activeNote) {
      // For editing existing note
      // Note: This doesn't actually modify the note since the editor component
      // is handling updates, but we update the local state for consistency
      setActiveNote({ ...activeNote, labels: labelIds });
    }
    // For new notes, the labels will be applied in the editor
  };

  return (
    <NotesProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col text-gray-900 dark:text-gray-100">
        <Header onNewNote={handleNewNote} onManageLabels={handleOpenLabelManager} />
        <FilterLabels />
        
        <main className="flex-grow">
          <NoteList onNoteClick={handleEditNote} />
        </main>
        
        {/* Note Editor */}
        {(isCreatingNote || activeNote) && (
          <AnimatedTransition show={true}>
            <NoteEditor
              note={activeNote ?? undefined}
              onClose={handleCloseEditor}
              onLabelsClick={handleOpenLabelSelector}
            />
          </AnimatedTransition>
        )}
        
        {/* Label Manager */}
        {showLabelManager && (
          <AnimatedTransition show={true}>
            <LabelManager
              onClose={() => setShowLabelManager(false)}
              onSelectLabels={labelManagerMode === 'select' ? handleLabelSelection : undefined}
              selectedLabels={activeNote?.labels}
            />
          </AnimatedTransition>
        )}
      </div>
    </NotesProvider>
  );
}

export default App;
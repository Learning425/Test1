import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { NotesProvider } from './context/NotesContext';
import Header from './components/Header';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import LabelManager from './components/LabelManager';
import FilterLabels from './components/FilterLabels';
import LoginForm from './components/Auth/LoginForm';
import SignUpForm from './components/Auth/SignUpForm';
import { Note } from './types';
import AnimatedTransition from './components/AnimatedTransition';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [showLabelManager, setShowLabelManager] = useState(false);
  const [labelManagerMode, setLabelManagerMode] = useState<'manage' | 'select'>('manage');
  const [session, setSession] = useState<any>(null);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
      setActiveNote({ ...activeNote, labels: labelIds });
    }
  };

  if (!session) {
    return showSignUp ? (
      <SignUpForm onShowLogin={() => setShowSignUp(false)} />
    ) : (
      <LoginForm onShowSignUp={() => setShowSignUp(true)} />
    );
  }

  return (
    <NotesProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col text-gray-900 dark:text-gray-100">
        <Header onNewNote={handleNewNote} onManageLabels={handleOpenLabelManager} />
        <FilterLabels />
        
        <main className="flex-grow">
          <NoteList onNoteClick={handleEditNote} />
        </main>
        
        {(isCreatingNote || activeNote) && (
          <AnimatedTransition show={true}>
            <NoteEditor
              note={activeNote ?? undefined}
              onClose={handleCloseEditor}
              onLabelsClick={handleOpenLabelSelector}
            />
          </AnimatedTransition>
        )}
        
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
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Note, Label, ViewMode } from '../types';
import { generateId } from '../utils/helpers';

interface NotesContextType {
  notes: Note[];
  labels: Label[];
  viewMode: ViewMode;
  searchQuery: string;
  activeLabels: string[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'isPinned'>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  addLabel: (name: string) => Label;
  updateLabel: (id: string, name: string) => void;
  deleteLabel: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  toggleActiveLabel: (labelId: string) => void;
  clearActiveLabels: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const defaultColors = [
  '#F87171', '#FB923C', '#FBBF24', '#A3E635', 
  '#34D399', '#22D3EE', '#60A5FA', '#A78BFA'
];

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [labels, setLabels] = useState<Label[]>(() => {
    const savedLabels = localStorage.getItem('labels');
    return savedLabels ? JSON.parse(savedLabels) : [];
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const savedViewMode = localStorage.getItem('viewMode');
    return (savedViewMode as ViewMode) || 'grid';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeLabels, setActiveLabels] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('labels', JSON.stringify(labels));
  }, [labels]);

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'isPinned'>) => {
    const now = Date.now();
    const newNote: Note = {
      id: generateId(),
      title: note.title,
      content: note.content,
      images: note.images || [],
      labels: note.labels || [],
      createdAt: now,
      updatedAt: now,
      isPinned: false,
    };
    
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: Date.now() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const togglePinNote = (id: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              isPinned: !note.isPinned,
              pinnedAt: !note.isPinned ? Date.now() : undefined,
              updatedAt: Date.now(),
            }
          : note
      )
    );
  };

  const addLabel = (name: string) => {
    const colorIndex = labels.length % defaultColors.length;
    const newLabel: Label = {
      id: generateId(),
      name,
      color: defaultColors[colorIndex],
      createdAt: Date.now(),
    };
    
    setLabels((prevLabels) => [...prevLabels, newLabel]);
    return newLabel;
  };

  const updateLabel = (id: string, name: string) => {
    setLabels((prevLabels) =>
      prevLabels.map((label) =>
        label.id === id ? { ...label, name } : label
      )
    );
  };

  const deleteLabel = (id: string) => {
    setLabels((prevLabels) => prevLabels.filter((label) => label.id !== id));
  };

  const toggleActiveLabel = (labelId: string) => {
    setActiveLabels((prev) => {
      if (prev.includes(labelId)) {
        return prev.filter((id) => id !== labelId);
      } else {
        return [...prev, labelId];
      }
    });
  };

  const clearActiveLabels = () => {
    setActiveLabels([]);
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && b.isPinned) {
      return (b.pinnedAt || 0) - (a.pinnedAt || 0);
    }
    if (a.isPinned) return -1;
    if (b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  const value = {
    notes: sortedNotes,
    labels,
    viewMode,
    searchQuery,
    activeLabels,
    addNote,
    updateNote,
    deleteNote,
    togglePinNote,
    addLabel,
    updateLabel,
    deleteLabel,
    setViewMode,
    setSearchQuery,
    toggleActiveLabel,
    clearActiveLabels,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
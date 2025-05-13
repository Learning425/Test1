import React, { useEffect, useState, useRef } from 'react';
import { X, Image, Tag, Lock, Lock as LockOpen, Share2, Users } from 'lucide-react';
import { Note } from '../types';
import { useNotes } from '../context/NotesContext';
import LabelPill from './LabelPill';
import PasswordDialog from './PasswordDialog';
import ShareDialog from './ShareDialog';
import { websocketService } from '../services/websocket';
import bcrypt from 'bcryptjs';

interface NoteEditorProps {
  note?: Note;
  onClose: () => void;
  onLabelsClick: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onClose, onLabelsClick }) => {
  const { addNote, updateNote } = useNotes();

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [images, setImages] = useState<string[]>(note?.images || []);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(note?.labels || []);
  const [currentNote, setCurrentNote] = useState<Note | undefined>(note);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(note?.isPasswordProtected || false);
  const [isLocked, setIsLocked] = useState(note?.isPasswordProtected || false);
  const [activeCollaborators, setActiveCollaborators] = useState<string[]>([]);

  const saveTimeoutRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lastSavedRef = useRef({
    title,
    content,
    images,
    labels: selectedLabels,
  });

  // WebSocket connection
  useEffect(() => {
    if (currentNote?.id && currentNote.sharedWith && currentNote.sharedWith.length > 0) {
      websocketService.connect(currentNote.id);

      websocketService.onNoteUpdate((update) => {
        if (update.title !== undefined) setTitle(update.title);
        if (update.content !== undefined) setContent(update.content);
        if (update.images !== undefined) setImages(update.images);
        if (update.labels !== undefined) setSelectedLabels(update.labels);
      });

      return () => {
        websocketService.disconnect();
      };
    }
  }, [currentNote?.id, currentNote?.sharedWith]);

  useEffect(() => {
    if (note?.isPasswordProtected && !note?.passwordHash) {
      setShowPasswordDialog(true);
      setIsSettingPassword(true);
    }
  }, [note]);

  const handlePasswordSubmit = async (password: string) => {
    if (isSettingPassword) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      
      if (currentNote?.id) {
        updateNote(currentNote.id, {
          ...currentNote,
          isPasswordProtected: true,
          passwordHash: hash,
        });
      }
      setIsPasswordProtected(true);
    } else {
      const isValid = await bcrypt.compare(password, currentNote?.passwordHash || '');
      if (isValid) {
        setIsLocked(false);
      } else {
        // Handle invalid password
        return;
      }
    }
    setShowPasswordDialog(false);
  };

  const handleShare = async (emails: string[], canEdit: boolean) => {
    if (currentNote?.id) {
      const sharedWith = emails.map(email => ({
        email,
        canEdit,
        sharedAt: Date.now(),
      }));
      
      updateNote(currentNote.id, {
        ...currentNote,
        sharedWith,
      });
    }
    setShowShareDialog(false);
  };

  const handleRemoveShare = (email: string) => {
    if (currentNote?.id && currentNote.sharedWith) {
      const updatedShares = currentNote.sharedWith.filter(share => share.email !== email);
      updateNote(currentNote.id, {
        ...currentNote,
        sharedWith: updatedShares,
      });
    }
  };

  // Auto-save logic with WebSocket sync
  useEffect(() => {
    if (isLocked) return;

    if (
      title.trim() === '' &&
      content.trim() === '' &&
      images.length === 0 &&
      selectedLabels.length === 0
    )
      return;

    const hasChanged =
      title !== lastSavedRef.current.title ||
      content !== lastSavedRef.current.content ||
      images.join() !== lastSavedRef.current.images.join() ||
      selectedLabels.join() !== lastSavedRef.current.labels.join();

    if (!hasChanged) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = window.setTimeout(() => {
      const updates = {
        title,
        content,
        images,
        labels: selectedLabels,
      };

      if (currentNote?.id) {
        updateNote(currentNote.id, updates);
        websocketService.emitNoteUpdate(updates);
      } else {
        const newNote = addNote(updates);
        setCurrentNote(newNote);
      }

      lastSavedRef.current = updates;
    }, 500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [title, content, images, selectedLabels, addNote, updateNote, currentNote, isLocked]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeLabel = (labelId: string) => {
    setSelectedLabels((prev) => prev.filter((id) => id !== labelId));
  };

  const togglePasswordProtection = () => {
    if (isPasswordProtected) {
      if (currentNote?.id) {
        updateNote(currentNote.id, {
          ...currentNote,
          isPasswordProtected: false,
          passwordHash: undefined,
        });
      }
      setIsPasswordProtected(false);
    } else {
      setIsSettingPassword(true);
      setShowPasswordDialog(true);
    }
  };

  if (isLocked) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
        <PasswordDialog
          title="Enter Password"
          onSubmit={handlePasswordSubmit}
          onCancel={onClose}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {note ? 'Edit Note' : 'New Note'}
            </h2>
            {activeCollaborators.length > 0 && (
              <div className="ml-4 flex items-center">
                <Users size={16} className="text-blue-500 mr-2" />
                <span className="text-sm text-gray-500">
                  {activeCollaborators.length} active
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 text-xl font-medium border-b mb-4 focus:outline-none focus:border-purple-500 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white"
          />

          <textarea
            placeholder="Start typing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 min-h-[200px] focus:outline-none resize-none bg-transparent text-gray-800 dark:text-gray-200"
          />

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {images.map((src, index) => (
                <div key={index} className="relative rounded overflow-hidden h-24">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedLabels.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedLabels.map((labelId) => (
                <LabelPill
                  key={labelId}
                  labelId={labelId}
                  showRemove
                  onRemove={() => removeLabel(labelId)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center">
          <div className="flex space-x-2">
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              <Image size={20} />
            </button>
            <button
              onClick={onLabelsClick}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              <Tag size={20} />
            </button>
            <button
              onClick={togglePasswordProtection}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {isPasswordProtected ? <Lock size={20} /> : <LockOpen size={20} />}
            </button>
            <button
              onClick={() => setShowShareDialog(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              <Share2 size={20} />
            </button>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Auto-saving...</span>
        </div>
      </div>

      {showPasswordDialog && (
        <PasswordDialog
          title={isSettingPassword ? 'Set Password' : 'Enter Password'}
          onSubmit={handlePasswordSubmit}
          onCancel={() => setShowPasswordDialog(false)}
          isSettingPassword={isSettingPassword}
        />
      )}

      {showShareDialog && (
        <ShareDialog
          onShare={handleShare}
          onClose={() => setShowShareDialog(false)}
          existingShares={currentNote?.sharedWith}
          onRemoveShare={handleRemoveShare}
        />
      )}
    </div>
  );
};

export default NoteEditor;
import React from 'react';
import { Pin, PinOff, Trash2 } from 'lucide-react';
import { Note } from '../types';
import { truncateText, formatDate, stripHtml } from '../utils/helpers';
import LabelPill from './LabelPill';

interface NoteItemProps {
  note: Note;
  isGrid: boolean;
  onNoteClick: (note: Note) => void;
  onPinToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  isGrid,
  onNoteClick,
  onPinToggle,
  onDelete,
}) => {
  const { id, title, content, images, isPinned, updatedAt, labels } = note;

  // Grid view
  if (isGrid) {
    return (
      <div
        className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-200 flex flex-col"
        style={{ height: '280px' }}
      >
        {images.length > 0 && (
          <div className="relative w-full h-40 overflow-hidden">
            <img src={images[0]} alt="" className="w-full h-full object-cover" />
            {images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white rounded-full px-2 py-1 text-xs">
                +{images.length - 1}
              </div>
            )}
          </div>
        )}

        <div className="p-4 flex-grow overflow-hidden" onClick={() => onNoteClick(note)}>
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
              {title || 'Untitled'}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPinToggle(id);
              }}
              className="ml-2 flex-shrink-0 text-gray-400 hover:text-yellow-500 transition-colors"
            >
              {isPinned ? <Pin size={18} className="text-yellow-500" /> : <PinOff size={18} />}
            </button>
          </div>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
            {truncateText(stripHtml(content), 150) || 'No content'}
          </p>

          {labels.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {labels.slice(0, 3).map((labelId) => (
                <LabelPill key={labelId} labelId={labelId} />
              ))}
              {labels.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
                  +{labels.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-750 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>{formatDate(updatedAt)}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow duration-200"
      onClick={() => onNoteClick(note)}
    >
      <div className="flex items-start">
        <div className="flex-grow overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
              {title || 'Untitled'}
            </h3>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                {formatDate(updatedAt)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPinToggle(id);
                }}
                className="mr-2 text-gray-400 hover:text-yellow-500 transition-colors"
              >
                {isPinned ? <Pin size={18} className="text-yellow-500" /> : <PinOff size={18} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {truncateText(stripHtml(content), 120) || 'No content'}
          </p>

          {labels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {labels.slice(0, 5).map((labelId) => (
                <LabelPill key={labelId} labelId={labelId} />
              ))}
              {labels.length > 5 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
                  +{labels.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>

        {images.length > 0 && (
          <div className="ml-4 flex-shrink-0 w-16 h-16 relative">
            <img src={images[0]} alt="" className="w-full h-full object-cover rounded" />
            {images.length > 1 && (
              <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                +{images.length - 1}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteItem;

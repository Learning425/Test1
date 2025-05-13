import React from 'react';
import { X } from 'lucide-react';
import { useNotes } from '../context/NotesContext';

interface LabelPillProps {
  labelId: string;
  onRemove?: () => void;
  showRemove?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const LabelPill: React.FC<LabelPillProps> = ({
  labelId,
  onRemove,
  showRemove = false,
  isActive = false,
  onClick,
}) => {
  const { labels } = useNotes();
  const label = labels.find((l) => l.id === labelId);

  if (!label) return null;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive ? 'ring-2 ring-offset-1' : ''
      }`}
      style={{
        backgroundColor: `${label.color}33`, // Adding opacity
        color: label.color,
        borderColor: label.color,
      }}
      onClick={onClick}
    >
      {label.name}
      {showRemove && (
        <button
          type="button"
          className="ml-1 flex-shrink-0 inline-flex"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        >
          <X size={14} />
        </button>
      )}
    </span>
  );
};

export default LabelPill;
import { RotateCcw } from 'lucide-react';

interface FlashcardModeToggleProps {
  isFlashcardMode: boolean;
  onClick: () => void;
}

export function FlashcardModeToggle({ isFlashcardMode, onClick }: FlashcardModeToggleProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center transition-all hover:scale-110"
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        backgroundColor: isFlashcardMode ? '#9B7EC7' : '#E6D5F0',
        border: `2px solid ${isFlashcardMode ? '#FFFFFF' : '#9B7EC7'}`,
        cursor: 'pointer',
        boxShadow: isFlashcardMode ? '0 4px 12px rgba(155, 126, 199, 0.4)' : 'none'
      }}
    >
      <RotateCcw 
        size={16} 
        color={isFlashcardMode ? '#FFFFFF' : '#9B7EC7'} 
        strokeWidth={2.5} 
      />
    </button>
  );
}

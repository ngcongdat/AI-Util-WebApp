interface Props {
  text: string;
  selectedIndices: number[];
  highlightColor: string;
  onChange: (indices: number[]) => void;
}

export default function WordSelector({ text, selectedIndices, highlightColor, onChange }: Props) {
  if (!text.trim()) return null;

  const words = text.trim().split(/\s+/);

  const toggle = (i: number) => {
    if (selectedIndices.includes(i)) {
      onChange(selectedIndices.filter(idx => idx !== i));
    } else {
      onChange([...selectedIndices, i]);
    }
  };

  return (
    <div className="mt-1.5">
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
        Click từ để highlight
      </p>
      <div className="flex flex-wrap gap-1">
        {words.map((word, i) => {
          const highlighted = selectedIndices.includes(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              className="text-xs px-1.5 py-0.5 rounded font-medium transition-all border"
              style={
                highlighted
                  ? { backgroundColor: highlightColor, color: '#fff', borderColor: highlightColor }
                  : { backgroundColor: 'transparent', color: '#6b7280', borderColor: '#e5e7eb' }
              }
            >
              {word}
            </button>
          );
        })}
      </div>
      {selectedIndices.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="mt-1.5 text-[10px] text-red-400 hover:text-red-600 transition-colors"
        >
          Xóa tất cả highlight
        </button>
      )}
    </div>
  );
}

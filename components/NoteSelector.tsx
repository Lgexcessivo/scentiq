import { NoteDef } from "@/data/notes";

interface NoteSelectorProps {
  notes: NoteDef[];
  selected: string[];
  otherSelected: string[];
  onToggle: (noteId: string) => void;
  variant: "like" | "dislike";
}

export default function NoteSelector({ notes, selected, otherSelected, onToggle, variant }: NoteSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {notes.map((note) => {
        const isSelected = selected.includes(note.id);
        const isInOther = otherSelected.includes(note.id);
        return (
          <button
            type="button"
            key={note.id}
            onClick={() => onToggle(note.id)}
            className={`chip ${isSelected ? (variant === "like" ? "chip-selected" : "chip-excluded") : ""} ${
              isInOther ? "opacity-40" : ""
            }`}
            title={isInOther ? "Também está na outra lista" : undefined}
          >
            {note.label}
          </button>
        );
      })}
    </div>
  );
}

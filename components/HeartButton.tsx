interface HeartButtonProps {
  active: boolean;
  onToggle: () => void;
}

export default function HeartButton({ active, onToggle }: HeartButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={`absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm transition-colors ${
        active ? "text-gold-400" : "text-neutral-300 hover:text-gold-400"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 21s-6.7-4.35-9.3-8.1C.8 10.1 1.4 6.6 4.3 5.1 6.6 3.9 9.4 4.6 12 7.3c2.6-2.7 5.4-3.4 7.7-2.2 2.9 1.5 3.5 5 1.6 7.8C18.7 16.65 12 21 12 21z" />
      </svg>
    </button>
  );
}

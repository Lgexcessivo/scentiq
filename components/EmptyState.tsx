interface EmptyStateProps {
  onEditPreferences: () => void;
}

export default function EmptyState({ onEditPreferences }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6">
      <p className="font-display text-xl mb-2">Nenhum perfume encontrado com esses filtros</p>
      <p className="text-neutral-500 mb-6">Tente remover algum filtro ou ajustar suas preferências.</p>
      <button onClick={onEditPreferences} className="btn-ghost">
        Ajustar preferências
      </button>
    </div>
  );
}

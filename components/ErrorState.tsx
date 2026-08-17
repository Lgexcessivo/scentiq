interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center animate-fade-in">
      <p className="text-red-400 font-display text-xl mb-3">Algo deu errado</p>
      <p className="text-neutral-400 mb-8">{message}</p>
      <button onClick={onRetry} className="btn-primary">
        Tentar novamente
      </button>
    </div>
  );
}

export default function LoadingState() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center animate-fade-in">
      <div className="w-12 h-12 mx-auto mb-6 rounded-full border-2 border-gold-500/30 border-t-gold-500 animate-spin" />
      <p className="text-neutral-300 font-display text-xl mb-2">
        Cruzando suas preferências com o catálogo...
      </p>
      <p className="text-neutral-500 text-sm">Calculando a compatibilidade de cada perfume</p>
    </div>
  );
}

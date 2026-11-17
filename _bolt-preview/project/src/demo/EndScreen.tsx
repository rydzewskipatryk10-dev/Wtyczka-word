type EndScreenProps = {
  onClose: () => void;
};

export function EndScreen({ onClose }: EndScreenProps) {
  return (
    <section className="end-screen" aria-label="Praca w kancelarii">
      <h2>Tak to działa w kancelarii.</h2>
      <ul>
        <li>Opisujesz zadanie własnymi słowami.</li>
        <li>Dokładasz własne dokumenty i własny wzór.</li>
        <li>Dostajesz obraz sprawy, szkic i kontrolę.</li>
        <li>Redagujesz pismo w Wordzie.</li>
      </ul>
      <button type="button" className="primary-action" onClick={onClose}>
        Zamknij
      </button>
    </section>
  );
}

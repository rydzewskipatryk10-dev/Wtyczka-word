import type { TourStep } from './case';

type TourProps = {
  step: TourStep;
  total: number;
  waiting: boolean;
  onNext: () => void;
};

export function spotlightIds(highlight: string): string[] {
  if (highlight === 'amounts') return ['amounts', 'file-umowa', 'file-faktura'];
  if (highlight === 'draft') return ['draft', 'letter'];
  return [highlight];
}

export function Tour({ step, total, waiting, onNext }: TourProps) {
  return (
    <footer className="tour-bar" aria-label="Prowadzenie">
      <p className="tour-count">Krok {step.index} z {total}</p>
      <p className="tour-bubble" role="status">{step.sentence}</p>
      <button type="button" className="primary-action" onClick={onNext} disabled={waiting}>
        Dalej
      </button>
    </footer>
  );
}

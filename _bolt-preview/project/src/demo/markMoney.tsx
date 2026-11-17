import { createContext, useContext, type ReactNode } from 'react';

const AmountMarkContext = createContext(false);

export function AmountMarks({ active, children }: { active: boolean; children: ReactNode }) {
  return <AmountMarkContext.Provider value={active}>{children}</AmountMarkContext.Provider>;
}

export function useAmountMarks(): boolean {
  return useContext(AmountMarkContext);
}

export function markMoney(text: string, active: boolean): ReactNode {
  if (!active || !text) return text;
  const pattern = /\d{1,3}(?:[ \u00A0]\d{3})*(?:[.,]\d{2})?\s*zł/giu;
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    nodes.push(
      <mark key={`${start}-${match[0]}`} className="amount-hit">{match[0]}</mark>,
    );
    last = start + match[0].length;
  }
  if (last === 0) return text;
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function MoneyText({ text }: { text: string }) {
  return <>{markMoney(text, useAmountMarks())}</>;
}

import { layoutScan, type ScanLayout } from './layoutScan';
import { MoneyText } from './markMoney';

type ScannedSheetProps = {
  text: string;
};

export function ScannedSheet({ text }: ScannedSheetProps) {
  const layout = layoutScan(text);
  return <div className={`a4-sheet a4-sheet--${layout.kind}`}>{renderLayout(layout)}</div>;
}

function SignRight({ sign }: { sign: string }) {
  if (!sign) return null;
  return (
    <div className="a4-sign-right">
      <p className="a4-sign-name"><MoneyText text={sign} /></p>
    </div>
  );
}

function renderLayout(layout: ScanLayout) {
  if (layout.kind === 'contract') {
    return (
      <>
        <h1 className="a4-title"><MoneyText text={layout.title} /></h1>
        {layout.intro ? <p className="a4-center"><MoneyText text={layout.intro} /></p> : null}
        <div className="a4-parties">
          {layout.parties.map((party, index) => (
            <div key={`${party}-${index}`}>
              {index > 0 ? <p className="a4-join"><MoneyText text={layout.join} /></p> : null}
              <p className="a4-party"><strong><MoneyText text={party} /></strong></p>
            </div>
          ))}
        </div>
        {layout.sections.map((section) => (
          <section key={section.title} className="a4-section">
            <h2><MoneyText text={section.title} /></h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}><MoneyText text={paragraph} /></p>
            ))}
          </section>
        ))}
        {layout.signs.length ? (
          <div className="a4-signs">
            {layout.signs.map((sign) => (
              <div key={sign.caption} className="a4-sign">
                <p><MoneyText text={`${sign.caption}:`} /></p>
                <p className="a4-sign-name"><MoneyText text={sign.name} /></p>
              </div>
            ))}
          </div>
        ) : null}
      </>
    );
  }

  if (layout.kind === 'invoice') {
    return (
      <>
        <h1 className="a4-title a4-title--left"><MoneyText text={layout.title} /></h1>
        {layout.subtitle ? <p className="a4-subtitle"><MoneyText text={layout.subtitle} /></p> : null}
        {layout.parties.length ? (
          <table className="a4-grid">
            <tbody>
              <tr>
                {layout.parties.map((party) => (
                  <td key={party.label}>
                    <span className="a4-grid-label"><MoneyText text={party.label} /></span>
                    <MoneyText text={party.name} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        ) : null}
        {layout.rows.length ? (
          <table className="a4-grid">
            <thead>
              <tr>
                {layout.columns.map((column) => (
                  <th key={column} scope="col"><MoneyText text={column} /></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {layout.rows.map((row) => (
                <tr key={row.join('|')}>
                  {row.map((cell) => (
                    <td key={cell}><MoneyText text={cell} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        {layout.total ? <p className="a4-total"><MoneyText text={layout.total} /></p> : null}
        {layout.payment ? <p className="a4-payment"><MoneyText text={layout.payment} /></p> : null}
        {layout.signs.length ? (
          <div className="a4-signs">
            {layout.signs.map((sign) => (
              <div key={sign} className="a4-sign">
                <p className="a4-sign-name"><MoneyText text={sign} /></p>
              </div>
            ))}
          </div>
        ) : null}
      </>
    );
  }

  if (layout.kind === 'letter') {
    return (
      <>
        <div className="a4-letter-head">
          <p className="a4-from"><MoneyText text={layout.from} /></p>
          {layout.date ? <p className="a4-date"><MoneyText text={layout.date} /></p> : null}
        </div>
        {layout.to ? <p className="a4-to"><MoneyText text={layout.to} /></p> : null}
        {layout.title ? <h1 className="a4-title"><MoneyText text={layout.title} /></h1> : null}
        {layout.subject ? <p className="a4-subject"><MoneyText text={layout.subject} /></p> : null}
        {layout.paragraphs.map((paragraph) => (
          <p key={paragraph} className="a4-body"><MoneyText text={paragraph} /></p>
        ))}
        <SignRight sign={layout.sign} />
      </>
    );
  }

  if (layout.kind === 'transfer') {
    return (
      <div className="a4-bank">
        <header className="a4-bank-head">
          <p className="a4-bank-brand"><MoneyText text={layout.brand} /></p>
          <p className="a4-bank-sub"><MoneyText text={layout.subtitle} /></p>
        </header>
        <div className="a4-bank-status">
          <span className="a4-bank-check" aria-hidden="true">✓</span>
          <p><MoneyText text={layout.status} /></p>
        </div>
        <p className="a4-bank-amount"><MoneyText text={layout.amount} /></p>
        <dl className="a4-bank-rows">
          {layout.rows.map((row) => (
            <div key={row.label} className="a4-bank-row">
              <dt><MoneyText text={row.label} /></dt>
              <dd><MoneyText text={row.value} /></dd>
            </div>
          ))}
        </dl>
        {layout.footer ? <p className="a4-bank-foot"><MoneyText text={layout.footer} /></p> : null}
      </div>
    );
  }

  if (layout.kind === 'template') {
    return (
      <>
        {layout.place ? <p className="a4-date"><MoneyText text={layout.place} /></p> : null}
        {layout.from ? <p className="a4-meta"><strong>Od:</strong> <MoneyText text={layout.from.replace(/^Od:\s*/i, '')} /></p> : null}
        {layout.to ? <p className="a4-meta"><strong>Do:</strong> <MoneyText text={layout.to.replace(/^Do:\s*/i, '')} /></p> : null}
        {layout.title ? <h1 className="a4-title"><MoneyText text={layout.title} /></h1> : null}
        {layout.subject ? <p className="a4-subject"><MoneyText text={layout.subject} /></p> : null}
        {layout.blocks.map((block) => (
          <section key={`${block.heading}-${block.lines[0] ?? ''}`} className="a4-section a4-section--left">
            {block.heading ? <h2><MoneyText text={block.heading} /></h2> : null}
            {block.lines.map((line) => (
              <p key={line}><MoneyText text={line} /></p>
            ))}
          </section>
        ))}
        <SignRight sign={layout.sign} />
      </>
    );
  }

  return (
    <>
      {layout.blocks.map((block) => {
        if (block.role === 'title') return <h1 key={block.text} className="a4-title a4-title--left"><MoneyText text={block.text} /></h1>;
        if (block.role === 'heading') return <h2 key={block.text} className="a4-plain-heading"><MoneyText text={block.text} /></h2>;
        if (block.role === 'table') {
          return (
            <table key={block.columns.join('|')} className="a4-grid">
              <thead>
                <tr>
                  {block.columns.map((column) => (
                    <th key={column} scope="col"><MoneyText text={column} /></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row.join('|')}>
                    {row.map((cell) => (
                      <td key={cell}><MoneyText text={cell} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        }
        return <p key={block.text} className="a4-body"><MoneyText text={block.text} /></p>;
      })}
    </>
  );
}

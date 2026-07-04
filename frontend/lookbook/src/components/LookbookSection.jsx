import { Lookbook } from './Lookbook';

export function LookbookSection({ config, credentials }) {
  return (
    <div className="lookbook-section">
      {config.lookbooks.map((lookbook, index) => (
        <Lookbook
          key={`${lookbook.title}-${index}`}
          lookbook={lookbook}
          credentials={credentials}
          country={config.country}
        />
      ))}
    </div>
  );
}
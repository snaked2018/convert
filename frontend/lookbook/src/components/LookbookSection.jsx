import { Lookbook } from './Lookbook';
import { LookbookCarousel } from './LookbookCarousel';

export function LookbookSection({ config, credentials }) {
  if (config.layout === 'product' && config.lookbooks.length > 1) {
    return <LookbookCarousel config={config} credentials={credentials} />;
  }

  return (
    <div className="lookbook-section">
      {config.lookbooks.map((lookbook, index) => (
        <Lookbook
          key={`${lookbook.title}-${index}`}
          lookbook={lookbook}
          credentials={credentials}
          config={config}
        />
      ))}
    </div>
  );
}

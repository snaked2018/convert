import { Lookbook } from './Lookbook';

export function LookbookSection({ config, credentials }) {
  return (
    <>
      {config.lookbooks.map((lookbook, index) => (
        <Lookbook
          key={`${lookbook.productHandles?.join('-') ?? 'lookbook'}-${index}`}
          lookbook={lookbook}
          credentials={credentials}
          config={config}
        />
      ))}
    </>
  );
}

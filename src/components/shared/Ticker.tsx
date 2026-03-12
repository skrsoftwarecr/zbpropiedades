import React from 'react';

const Message = () => (
    <span className="mx-12 text-xl font-bold tracking-widest uppercase">
        De todo para tu auto europeo <span className="text-accent px-4">/</span> BMW <span className="text-accent px-4">/</span> AUDI <span className="text-accent px-4">/</span> VW <span className="text-accent px-4">/</span> MERCEDES
    </span>
);

export function Ticker() {
  return (
    <section aria-label="Marcas que manejamos" className="bg-background py-3 sm:py-4">
        <div className="font-code relative flex overflow-hidden bg-primary text-primary-foreground py-4 border-y-2 border-foreground -rotate-1 my-2">
            <div className="flex min-w-full animate-marquee whitespace-nowrap">
                <Message />
                <Message />
                <Message />
            </div>
        </div>
    </section>
  );
}

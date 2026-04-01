import type { ReactNode } from "react";

interface PageScaffoldProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export default function PageScaffold({
  title,
  description,
  children,
}: PageScaffoldProps) {
  return (
    <section className="surface-card mx-auto my-12 max-w-6xl space-y-5 p-6 md:p-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {title}
        </h1>
        <p className="max-w-3xl text-base text-slate-200/90 md:text-lg">
          {description}
        </p>
      </header>
      {children}
    </section>
  );
}

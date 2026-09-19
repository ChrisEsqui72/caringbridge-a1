interface PageHeaderProps {
    eyebrow?: string;
    title: string;
    description?: string;
}

export function PageHeader({
    eyebrow,
    title,
    description
}: PageHeaderProps) {
    return (
        <header>
            {eyebrow && (
                <p className="text-sm font-semibold tracking-wide text-[var(--cb-green-600)]">
                    {eyebrow}
                </p>
            )}

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--cb-text)] sm:text-4xl">
                {title}
            </h1>

            {description && (
                <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--cb-text-muted)]">
                    {description}
                </p>
            )}
        </header>
    );
}
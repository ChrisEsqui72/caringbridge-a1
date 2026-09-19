interface PageShellProps {
    children: React.ReactNode;
}

export function PageShell({ children }: PageShellProps) {
    return (
        <main className="min-h-screen bg-[var(--cb-background)] px-4 py-8 sm:px-6 lg:py-12">
            <div className="mx-auto w-full max-w-3xl">
                {children}
            </div>
        </main>
    );
}
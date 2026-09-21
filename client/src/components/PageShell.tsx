import { BrandHeader } from "./BrandHeader";

interface PageShellProps {
    children: React.ReactNode;
}

export function PageShell({ children }: PageShellProps) {
    return (
        <main className="cb-shell">
            <BrandHeader />

            <div className="cb-shell__inner">
                {children}
            </div>
        </main>
    );
}

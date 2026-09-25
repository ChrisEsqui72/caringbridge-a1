import { BrandHeader } from "./BrandHeader";
import { ProgressBar } from "./ProgressBar";

interface PageShellProps {
    children: React.ReactNode;
    step?: number;
    totalSteps?: number;
}

export function PageShell({
    children,
    step,
    totalSteps
}: PageShellProps) {
    return (
        <main className="cb-shell">
            <BrandHeader />

            {/* Sticky, so it stays in view on the longer forms. */}
            {step !== undefined && totalSteps !== undefined && (
                <div className="cb-shell__progress">
                    <ProgressBar
                        current={step}
                        total={totalSteps}
                    />
                </div>
            )}

            <div className="cb-shell__inner">
                {children}
            </div>
        </main>
    );
}

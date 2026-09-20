interface Props {
    current: number;
    total: number;
}

export function ProgressBar({
    current,
    total
}: Props) {
    const percentage =
        total > 0
            ? Math.min((current / total) * 100, 100)
            : 0;

    return (
        <div className="w-full">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--cb-text-muted)]">
                    Your progress
                </span>

                <span className="text-xs font-medium text-[var(--cb-text-muted)]">
                    {current} of {total}
                </span>
            </div>

            <div
                className="
                    h-2
                    w-full
                    overflow-hidden
                    rounded-full
                    bg-[var(--cb-gray-200)]
                "
                role="progressbar"
                aria-valuenow={current}
                aria-valuemin={0}
                aria-valuemax={total}
            >
                <div
                    className="
                        h-full
                        rounded-full
                        bg-[var(--cb-green-500)]
                        transition-[width]
                        duration-500
                        ease-out
                    "
                    style={{
                        width: `${percentage}%`
                    }}
                />
            </div>
        </div>
    );
}
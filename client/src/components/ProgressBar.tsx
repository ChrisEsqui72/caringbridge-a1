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
        <div className="cb-progress">
            <div className="cb-progress__meta">
                <span className="cb-progress__label">
                    Your progress
                </span>

                <span className="cb-progress__count">
                    {current} of {total}
                </span>
            </div>

            <div
                className="cb-progress__track"
                role="progressbar"
                aria-valuenow={current}
                aria-valuemin={0}
                aria-valuemax={total}
            >
                <div
                    className="cb-progress__fill"
                    style={{
                        width: `${percentage}%`
                    }}
                />
            </div>
        </div>
    );
}

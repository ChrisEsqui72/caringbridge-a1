interface Props {
    current: number;
    total: number;
}

export function ProgressBar({
    current,
    total
}: Props) {
    const percentage =
        (current / total) * 100;

    return (
        <div className="progress-wrapper">
            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{
                        width: `${percentage}%`
                    }}
                />
            </div>

            <span>
                {current} of {total}
            </span>
        </div>
    );
}
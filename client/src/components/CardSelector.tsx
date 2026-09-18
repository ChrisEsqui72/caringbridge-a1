export interface CardOption<T> {
    value: T;
    title: string;
    description: string;
    icon?: string;
}

interface CardSelectorProps<T> {
    options: CardOption<T>[];
    value: T | null;
    onChange: (value: T) => void;
}

export function CardSelector<T>({
    options,
    value,
    onChange
}: CardSelectorProps<T>) {
    return (
        <div className="card-selector">
            {options.map((option) => {
                const selected = value === option.value;

                return (
                    <button
                        key={String(option.value)}
                        type="button"
                        className={`selection-card ${
                            selected ? "selected" : ""
                        }`}
                        onClick={() => onChange(option.value)}
                    >
                        {option.icon && (
                            <span className="selection-icon">
                                {option.icon}
                            </span>
                        )}

                        <span className="selection-title">
                            {option.title}
                        </span>

                        <span className="selection-description">
                            {option.description}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
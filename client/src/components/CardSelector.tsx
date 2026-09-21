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
        <div className="cb-option-grid">
            {options.map((option) => {
                const selected = value === option.value;

                return (
                    <button
                        key={String(option.value)}
                        type="button"
                        aria-pressed={selected}
                        className={`cb-option${
                            selected ? " cb-option--selected" : ""
                        }`}
                        onClick={() => onChange(option.value)}
                    >
                        {selected && (
                            <span className="cb-option__check">
                                ✓
                            </span>
                        )}

                        {option.icon && (
                            <span className="cb-option__icon">
                                {option.icon}
                            </span>
                        )}

                        <span className="cb-option__title">
                            {option.title}
                        </span>

                        <span className="cb-option__description">
                            {option.description}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

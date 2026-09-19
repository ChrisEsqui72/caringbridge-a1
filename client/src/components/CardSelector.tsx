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
        <div className="grid gap-4 sm:grid-cols-2">
            {options.map((option) => {
                const selected = value === option.value;

                return (
                    <button
                        key={String(option.value)}
                        type="button"
                        aria-pressed={selected}
                        className={`
                            group
                            relative
                            flex
                            min-h-40
                            flex-col
                            items-start
                            rounded-[var(--cb-radius-lg)]
                            border
                            p-5
                            text-left
                            transition-all
                            duration-150
                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-[var(--cb-green-400)]
                            focus-visible:ring-offset-2
                            ${
                                selected
                                    ? "border-[var(--cb-green-500)] bg-[var(--cb-green-50)] shadow-[var(--cb-shadow-sm)]"
                                    : "border-[var(--cb-border)] bg-white hover:-translate-y-0.5 hover:border-[var(--cb-green-300)] hover:shadow-[var(--cb-shadow-md)]"
                            }
                        `}
                        onClick={() => onChange(option.value)}
                    >
                        {selected && (
                            <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--cb-green-500)] text-sm font-bold text-white">
                                ✓
                            </span>
                        )}

                        {option.icon && (
                            <span
                                className={`
                                    mb-4 flex h-11 w-11 items-center justify-center
                                    rounded-[var(--cb-radius-md)]
                                    text-xl
                                    transition-colors
                                    ${
                                        selected
                                            ? "bg-[var(--cb-green-100)]"
                                            : "bg-[var(--cb-gray-100)] group-hover:bg-[var(--cb-green-50)]"
                                    }
                                `}
                            >
                                {option.icon}
                            </span>
                        )}

                        <span className="text-base font-semibold text-[var(--cb-text)]">
                            {option.title}
                        </span>

                        <span className="mt-1.5 text-sm leading-6 text-[var(--cb-text-muted)]">
                            {option.description}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
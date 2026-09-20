interface CheckboxCardProps {
    title: string;
    description?: string;
    icon?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export function CheckboxCard({
    title,
    description,
    icon,
    checked,
    onChange
}: CheckboxCardProps) {
    return (
        <button
            type="button"
            aria-pressed={checked}
            onClick={() => onChange(!checked)}
            className={`
                group
                flex
                w-full
                items-center
                justify-between
                gap-4
                rounded-[var(--cb-radius-lg)]
                border
                p-4
                text-left
                transition-all
                duration-150
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--cb-green-400)]
                focus-visible:ring-offset-2
                ${
                    checked
                        ? "border-[var(--cb-green-500)] bg-[var(--cb-green-50)] shadow-[var(--cb-shadow-sm)]"
                        : "border-[var(--cb-border)] bg-white hover:border-[var(--cb-green-300)] hover:bg-[var(--cb-gray-50)] hover:shadow-[var(--cb-shadow-sm)]"
                }
            `}
        >
            <div className="flex min-w-0 items-center gap-4">
                {icon && (
                    <span
                        className={`
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-[var(--cb-radius-md)]
                            text-lg
                            transition-colors
                            ${
                                checked
                                    ? "bg-[var(--cb-green-100)]"
                                    : "bg-[var(--cb-gray-100)] group-hover:bg-[var(--cb-green-50)]"
                            }
                        `}
                    >
                        {icon}
                    </span>
                )}

                <div className="min-w-0">
                    <span className="block text-sm font-semibold text-[var(--cb-text)]">
                        {title}
                    </span>

                    {description && (
                        <span className="mt-1 block text-sm leading-5 text-[var(--cb-text-muted)]">
                            {description}
                        </span>
                    )}
                </div>
            </div>

            <span
                className={`
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    border
                    text-sm
                    font-bold
                    transition-all
                    ${
                        checked
                            ? "border-[var(--cb-green-600)] bg-[var(--cb-green-600)] text-white"
                            : "border-[var(--cb-gray-300)] bg-white text-transparent group-hover:border-[var(--cb-green-400)]"
                    }
                `}
                aria-hidden="true"
            >
                ✓
            </span>
        </button>
    );
}
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
            className={`cb-check${
                checked ? " cb-check--checked" : ""
            }`}
        >
            <span className="cb-check__main">
                {icon && (
                    <span className="cb-check__icon">
                        {icon}
                    </span>
                )}

                <span className="cb-check__text">
                    <span className="cb-check__title">
                        {title}
                    </span>

                    {description && (
                        <span className="cb-check__description">
                            {description}
                        </span>
                    )}
                </span>
            </span>

            <span
                className="cb-check__box"
                aria-hidden="true"
            >
                ✓
            </span>
        </button>
    );
}

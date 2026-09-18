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
            className={`checkbox-card ${
                checked ? "selected" : ""
            }`}
            onClick={() => onChange(!checked)}
        >
            <div className="checkbox-card-content">
                {icon && <span>{icon}</span>}

                <div>
                    <strong>{title}</strong>

                    {description && (
                        <p>{description}</p>
                    )}
                </div>
            </div>

            <div className="checkbox">
                {checked ? "✓" : ""}
            </div>
        </button>
    );
}
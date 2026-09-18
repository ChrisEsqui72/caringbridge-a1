interface TextAreaProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    required?: boolean;
}

export function TextArea({
    label,
    value,
    onChange,
    placeholder,
    rows = 5,
    required
}: TextAreaProps) {
    return (
        <label className="form-field">
            <span>{label}</span>

            <textarea
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                placeholder={placeholder}
                rows={rows}
                required={required}
            />
        </label>
    );
}
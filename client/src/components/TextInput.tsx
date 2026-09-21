interface TextInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    type?: "text" | "date" | "email" | "tel";
}

export function TextInput({
    label,
    value,
    onChange,
    placeholder,
    required,
    type = "text"
}: TextInputProps) {
    return (
        <label className="cb-field">
            <span className="cb-field__label">
                {label}
                {required && (
                    <span className="cb-field__required">
                        *
                    </span>
                )}
            </span>

            <input
                type={type}
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                placeholder={placeholder}
                required={required}
                className="cb-field__control"
            />
        </label>
    );
}

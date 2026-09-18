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
    required
}: TextInputProps) {
    return (
        <label className="form-field">
            <span>{label}</span>

            <input
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                placeholder={placeholder}
                required={required}
            />
        </label>
    );
}
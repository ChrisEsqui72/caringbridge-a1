import { useId } from "react";

interface TextAreaProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    required?: boolean;
    error?: string;
}

export function TextArea({
    label,
    value,
    onChange,
    placeholder,
    rows = 5,
    required,
    error
}: TextAreaProps) {
    const errorId = useId();

    return (
        <label className="cb-field">
            <span className="cb-field__label">
                {label}
                {required && (
                    <span
                        className="cb-field__required"
                        aria-hidden="true"
                    >
                        *
                    </span>
                )}
            </span>

            <textarea
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                placeholder={placeholder}
                rows={rows}
                required={required}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className="cb-field__control"
            />

            {error && (
                <span id={errorId} className="cb-field__error">
                    {error}
                </span>
            )}
        </label>
    );
}

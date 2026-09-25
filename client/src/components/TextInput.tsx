import { useId } from "react";

interface TextInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    type?: "text" | "date" | "email" | "tel";
    error?: string;
    // Marks the field invalid when its message is shown elsewhere, such
    // as one message shared by a group of fields.
    invalid?: boolean;
    describedBy?: string;
}

export function TextInput({
    label,
    value,
    onChange,
    placeholder,
    required,
    type = "text",
    error,
    invalid,
    describedBy
}: TextInputProps) {
    const errorId = useId();
    const isInvalid = Boolean(error) || Boolean(invalid);
    const descriptionIds =
        [error ? errorId : undefined, describedBy]
            .filter(Boolean)
            .join(" ") || undefined;

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

            <input
                type={type}
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                placeholder={placeholder}
                required={required}
                aria-invalid={isInvalid}
                aria-describedby={descriptionIds}
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

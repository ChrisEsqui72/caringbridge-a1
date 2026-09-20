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
        <label className="block w-full">
            <span className="mb-2 block text-sm font-semibold text-[var(--cb-text)]">
                {label}
                {required && (
                    <span className="ml-1 text-[var(--cb-green-600)]">
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
                className="w-full resize-y rounded-xl border border-[var(--cb-border)] bg-[var(--cb-bg)] px-4 py-3 text-[var(--cb-text)] shadow-sm outline-none transition placeholder:text-[var(--cb-text-muted)] focus:border-[var(--cb-green-600)] focus:ring-4 focus:ring-[var(--cb-green-100)]"
            />
        </label>
    );
}
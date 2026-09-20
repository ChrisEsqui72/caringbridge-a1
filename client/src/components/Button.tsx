interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    variant?: "primary" | "secondary" | "ghost";
    disabled?: boolean;
}

export function Button({
    children,
    onClick,
    type = "button",
    variant = "primary",
    disabled = false
}: ButtonProps) {
    const baseStyles = `
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-[var(--cb-radius-md)]
        px-5
        py-2.5
        text-sm
        font-semibold
        transition-all
        duration-150
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--cb-green-400)]
        focus-visible:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-50
    `;

    const variantStyles = {
        primary: `
            bg-[var(--cb-green-600)]
            text-white
            shadow-[var(--cb-shadow-sm)]
            hover:bg-[var(--cb-green-700)]
            hover:shadow-[var(--cb-shadow-md)]
            active:translate-y-px
        `,

        secondary: `
            border
            border-[var(--cb-border)]
            bg-white
            text-[var(--cb-text)]
            hover:border-[var(--cb-green-300)]
            hover:bg-[var(--cb-green-50)]
        `,

        ghost: `
            bg-transparent
            text-[var(--cb-text-muted)]
            hover:bg-[var(--cb-gray-100)]
            hover:text-[var(--cb-text)]
        `
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles[variant]}`}
        >
            {children}
        </button>
    );
}
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    variant?: "primary" | "secondary" | "ghost";
    disabled?: boolean;
    describedBy?: string;
}

export function Button({
    children,
    onClick,
    type = "button",
    variant = "primary",
    disabled = false,
    describedBy
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            aria-describedby={describedBy}
            className={`cb-btn cb-btn--${variant}`}
        >
            {children}
        </button>
    );
}

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
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`cb-btn cb-btn--${variant}`}
        >
            {children}
        </button>
    );
}

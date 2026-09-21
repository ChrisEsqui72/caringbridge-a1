interface PageHeaderProps {
    eyebrow?: string;
    title: string;
    description?: string;
}

export function PageHeader({
    eyebrow,
    title,
    description
}: PageHeaderProps) {
    return (
        <header className="cb-page-header">
            {eyebrow && (
                <p className="cb-page-header__eyebrow">
                    {eyebrow}
                </p>
            )}

            <h1 className="cb-page-header__title">
                {title}
            </h1>

            {description && (
                <p className="cb-page-header__description">
                    {description}
                </p>
            )}
        </header>
    );
}

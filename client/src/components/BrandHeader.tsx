export function BrandHeader() {
    return (
        <div className="cb-brand-header">
            <a
                className="cb-brand-header__logo"
                href="https://www.caringbridge.org/"
            >
                <img
                    className="cb-brand-header__wordmark"
                    src="/caringbridge-wordmark.svg"
                    alt="CaringBridge"
                    width={240}
                    height={34}
                />
            </a>

            <span className="cb-brand-header__badge">
                Prototype
            </span>
        </div>
    );
}

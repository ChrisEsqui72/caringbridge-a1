export function BrandHeader() {
    return (
        <div className="cb-brand-header">
            {/*
              * Not a link: this sits above every step of the flow, and all
              * onboarding state is in memory, so navigating away would
              * discard whatever the user has entered so far.
              */}
            <span className="cb-brand-header__logo">
                <img
                    className="cb-brand-header__wordmark"
                    src="/caringbridge-wordmark.svg"
                    alt="CaringBridge"
                    width={240}
                    height={34}
                />
            </span>

            <span className="cb-brand-header__badge">
                Prototype
            </span>
        </div>
    );
}

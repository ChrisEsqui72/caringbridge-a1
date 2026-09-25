import { useEffect, useRef, useState } from "react";

import type { FieldErrors } from "../lib/validation";

/**
 * Runs `validate` when the user tries to continue. Errors stay hidden
 * until that first attempt, then track the fields live so each one clears
 * as it's fixed. A failed attempt moves focus to the first invalid field.
 */
export function useValidatedSubmit<Field extends string>(
    validate: () => FieldErrors<Field>,
    onValid: () => void
) {
    const [hasAttempted, setHasAttempted] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const formRef = useRef<HTMLDivElement>(null);

    const errors: FieldErrors<Field> = hasAttempted ? validate() : {};

    useEffect(() => {
        if (failedAttempts === 0) return;

        const firstInvalid = formRef.current?.querySelector<HTMLElement>(
            '[aria-invalid="true"]'
        );

        // Focus alone can leave the field's label and error off-screen.
        firstInvalid?.focus({ preventScroll: true });
        firstInvalid?.scrollIntoView({ block: "center" });
    }, [failedAttempts]);

    const submit = () => {
        setHasAttempted(true);

        if (Object.keys(validate()).length === 0) {
            onValid();
            return;
        }

        setFailedAttempts((count) => count + 1);
    };

    return { errors, submit, formRef };
}

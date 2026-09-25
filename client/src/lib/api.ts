import type {
    Draft,
    OnboardingData
} from "../../../shared/types";

const API_URL =
    import.meta.env.VITE_API_URL ??
    "http://localhost:3001";

// Generation normally takes seconds. Past this, treat the server as
// unavailable rather than leaving the user on a spinner indefinitely.
const REQUEST_TIMEOUT_MS = 60_000;

const withTimeout = (signal?: AbortSignal): AbortSignal =>
    signal
        ? AbortSignal.any([signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)])
        : AbortSignal.timeout(REQUEST_TIMEOUT_MS);

export async function generateDrafts(
    onboarding: OnboardingData,
    signal?: AbortSignal
): Promise<Draft[]> {
    const response = await fetch(
        `${API_URL}/api/drafts/generate`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ onboarding }),
            signal: withTimeout(signal)
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to generate drafts."
        );
    }

    const result = await response.json();

    return result.drafts;
}

export async function regenerateDraft(
    onboarding: OnboardingData,
    draft: Draft
): Promise<Draft> {
    const response = await fetch(
        `${API_URL}/api/drafts/regenerate`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                onboarding,
                draft
            }),
            signal: withTimeout()
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to regenerate draft."
        );
    }

    const result = await response.json();

    return result.draft;
}
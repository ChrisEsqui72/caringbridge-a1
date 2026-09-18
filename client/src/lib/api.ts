import type {
    Draft,
    OnboardingData
} from "../../../shared/types";

const API_URL =
    import.meta.env.VITE_API_URL ??
    "http://localhost:3001";

export async function generateDrafts(
    onboarding: OnboardingData
): Promise<Draft[]> {
    const response = await fetch(
        `${API_URL}/api/drafts/generate`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ onboarding })
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
            })
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
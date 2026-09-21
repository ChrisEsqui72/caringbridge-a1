import type { Draft } from "../../../shared/types";
import { Button } from "./Button";

interface Props {
    draft: Draft;
    loading?: boolean;
    onSelect: () => void;
    onRegenerate: () => void;
}

const toneLabels = {
    "warm-personal": "Warm & Personal",
    "clear-informative": "Clear & Informative",
    "community-focused": "Community-Focused",
    "custom": "Your Own Words"
};

const toneDescriptions = {
    "warm-personal": "Personal and heartfelt",
    "clear-informative": "Straightforward and informative",
    "community-focused": "Focused on staying connected",
    "custom": "Written by you"
};

export function DraftCard({
    draft,
    loading = false,
    onSelect,
    onRegenerate
}: Props) {
    return (
        <article
            className="
                flex
                flex-col
                overflow-hidden
                rounded-[var(--cb-radius-xl)]
                border
                border-[var(--cb-border)]
                bg-white
                shadow-[var(--cb-shadow-md)]
                transition-shadow
                duration-200
                hover:shadow-[var(--cb-shadow-lg)]
            "
        >
            <div className="border-b border-[var(--cb-border)] bg-[var(--cb-gray-50)] px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <span
                            className="
                                inline-flex
                                rounded-full
                                bg-[var(--cb-green-100)]
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                text-[var(--cb-green-700)]
                            "
                        >
                            {toneLabels[draft.tone]}
                        </span>

                        <p className="mt-2 text-xs text-[var(--cb-text-muted)]">
                            {toneDescriptions[draft.tone]}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col px-6 py-6">
                <h2 className="text-xl font-bold tracking-tight text-[var(--cb-text)]">
                    {draft.title}
                </h2>

                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[var(--cb-gray-700)]">
                    {draft.body}
                </p>

                <div className="mt-6 rounded-[var(--cb-radius-md)] bg-[var(--cb-gray-50)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cb-text-muted)]">
                        This draft covers
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {draft.coveredTopics.map((topic) => (
                            <span
                                key={topic}
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-full
                                    border
                                    border-[var(--cb-green-200)]
                                    bg-white
                                    px-2.5
                                    py-1
                                    text-xs
                                    font-medium
                                    text-[var(--cb-green-700)]
                                "
                            >
                                <span aria-hidden="true">✓</span>
                                {topic}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Button onClick={onSelect}>
                        Use this draft →
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={onRegenerate}
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Try another version"}
                    </Button>
                </div>
            </div>
        </article>
    );
}
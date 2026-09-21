import {
    useEffect,
    useState,
    type Dispatch,
    type SetStateAction
} from "react";
import type {
    Draft,
    OnboardingData
} from "../../../shared/types";
import { DraftCard } from "../components/DraftCard";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/Button";
import {
    generateDrafts,
    regenerateDraft
} from "../lib/api";

interface Props {
    data: OnboardingData;
    drafts: Draft[];
    setDrafts: Dispatch<SetStateAction<Draft[]>>;
    onSelect: (draft: Draft) => void;
    onBack: () => void;
    onDraftOwn: () => void;
}

const isOwnDraft = (draft: Draft) =>
    draft.tone === "custom";

/**
 * Swaps in a fresh set of generated drafts while keeping anything the user
 * wrote. Applied as a state updater, not against a captured `drafts`,
 * because generation is slow: by the time it resolves the user may have
 * added a draft of their own, and a stale snapshot would erase it.
 */
const withGenerated =
    (generated: Draft[]) => (current: Draft[]) => [
        ...generated,
        ...current.filter(isOwnDraft)
    ];

export function DraftsPage({
    data,
    drafts,
    setDrafts,
    onSelect,
    onBack,
    onDraftOwn
}: Props) {
    const [loadingId, setLoadingId] =
        useState<string | null>(null);

    const [loadingAll, setLoadingAll] =
        useState(false);

    // Keyed on generated drafts, not the whole list: a user-written draft
    // should not stop the three generated ones from loading.
    const hasGenerated = drafts.some(
        (draft) => !isOwnDraft(draft)
    );

    const [loadingInitial, setLoadingInitial] =
        useState(!hasGenerated);

    useEffect(() => {
        if (!hasGenerated) {
            setLoadingInitial(true);

            generateDrafts(data)
                .then((generated) =>
                    setDrafts(withGenerated(generated))
                )
                .catch((error) => {
                    console.error(
                        "Failed to generate drafts:",
                        error
                    );
                })
                .finally(() => {
                    setLoadingInitial(false);
                });
        }
    }, [data, hasGenerated, setDrafts]);

    async function handleRegenerate(
        draft: Draft
    ) {
        try {
            setLoadingId(draft.id);

            const updated =
                await regenerateDraft(
                    data,
                    draft
                );

            setDrafts((current) =>
                current.map((item) =>
                    item.id === draft.id
                        ? updated
                        : item
                )
            );
        } finally {
            setLoadingId(null);
        }
    }

    async function handleRegenerateAll() {
        try {
            setLoadingAll(true);

            const updated =
                await generateDrafts(data);

            setDrafts(withGenerated(updated));
        } finally {
            setLoadingAll(false);
        }
    }

    return (
        <>
            <PageHeader
                eyebrow="Your drafts"
                title="Three ways to tell your story."
                description="Choose the version that feels most like you, or try another."
            />

            {loadingInitial ? (
                <div className="py-12 text-center">
                    <p className="text-lg font-medium">
                        Creating your drafts...
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        We're turning your information into a few
                        different ways to tell your story.
                    </p>
                </div>
            ) : (
                <div className="mx-auto mt-8 w-full max-w-3xl space-y-5">
                    {drafts.map((draft) => (
                        <DraftCard
                            key={draft.id}
                            draft={draft}
                            loading={
                                loadingId === draft.id
                            }
                            onSelect={() =>
                                onSelect(draft)
                            }
                            onRegenerate={() =>
                                handleRegenerate(draft)
                            }
                        />
                    ))}
                </div>
            )}

            <div className="mt-6 flex justify-center">
                <Button
                    variant="secondary"
                    onClick={handleRegenerateAll}
                    disabled={
                        loadingAll || loadingInitial
                    }
                >
                    {loadingAll
                        ? "Creating new drafts..."
                        : "Try three new versions"}
                </Button>
            </div>

            <div className="mx-auto mt-8 flex w-full max-w-3xl items-center justify-between px-2 sm:px-4">
                <Button
                    variant="secondary"
                    onClick={onBack}
                >
                    ← Back
                </Button>

                <Button
                    variant="secondary"
                    onClick={onDraftOwn}
                >
                    Draft my own post
                </Button>
            </div>
        </>
    );
}
import { useEffect, useState } from "react";
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
import { generateFakeDrafts } from "../lib/fakeDrafts";

interface Props {
    data: OnboardingData;
    drafts: Draft[];
    setDrafts: (drafts: Draft[]) => void;
    onSelect: (draft: Draft) => void;
    onBack: () => void;
    onNext: () => void;
}

export function DraftsPage({
    data,
    drafts,
    setDrafts,
    onSelect,
    onBack,
    onNext
}: Props) {
    const [loadingId, setLoadingId] =
        useState<string | null>(null);

    const [loadingAll, setLoadingAll] =
        useState(false);

    useEffect(() => {
        if (drafts.length === 0) {
            setDrafts(generateFakeDrafts(data));
        }
    }, [drafts.length, setDrafts]);

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

            setDrafts(
                drafts.map((item) =>
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

            setDrafts(updated);
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
                            handleRegenerate(
                                draft
                            )
                        }
                    />
                ))}
            </div>

            <div className="mt-6 flex justify-center">
                <Button
                    variant="secondary"
                    onClick={handleRegenerateAll}
                    disabled={loadingAll}
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
            </div>
        </>
    );
}
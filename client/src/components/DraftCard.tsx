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
    // The user's own words are not a generated draft: regenerating would
    // send them to the model and overwrite them.
    const isOwnDraft = draft.tone === "custom";

    return (
        <article className="cb-draft">
            <div className="cb-draft__header">
                <span className="cb-draft__tone">
                    {toneLabels[draft.tone]}
                </span>

                <p className="cb-draft__tone-description">
                    {toneDescriptions[draft.tone]}
                </p>
            </div>

            <div className="cb-draft__body">
                <h2 className="cb-draft__title">
                    {draft.title}
                </h2>

                <p className="cb-draft__text">
                    {draft.body}
                </p>

                {draft.coveredTopics.length > 0 && (
                    <div className="cb-draft__topics">
                        <p className="cb-draft__topics-label">
                            This draft covers
                        </p>

                        <div className="cb-draft__topic-list">
                            {draft.coveredTopics.map((topic) => (
                                <span
                                    key={topic}
                                    className="cb-draft__topic"
                                >
                                    <span aria-hidden="true">✓</span>
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="cb-draft__actions">
                    <Button onClick={onSelect}>
                        {isOwnDraft
                            ? "Keep editing →"
                            : "Use this draft →"}
                    </Button>

                    {!isOwnDraft && (
                        <Button
                            variant="secondary"
                            onClick={onRegenerate}
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Try another version"}
                        </Button>
                    )}
                </div>
            </div>
        </article>
    );
}

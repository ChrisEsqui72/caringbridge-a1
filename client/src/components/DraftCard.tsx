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
    "community-focused": "Community-Focused"
};

export function DraftCard({
    draft,
    loading,
    onSelect,
    onRegenerate
}: Props) {
    return (
        <article className="draft-card">
            <span className="draft-tone">
                {toneLabels[draft.tone]}
            </span>

            <h2>{draft.title}</h2>

            <p className="draft-body">
                {draft.body}
            </p>

            <div className="covered-topics">
                <strong>This draft covers</strong>

                <div>
                    {draft.coveredTopics.map(
                        (topic) => (
                            <span key={topic}>
                                ✓ {topic}
                            </span>
                        )
                    )}
                </div>
            </div>

            <div className="draft-actions">
                <Button onClick={onSelect}>
                    Use this draft
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
        </article>
    );
}
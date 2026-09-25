import { useState } from "react";
import type { Draft, OnboardingData } from "../../../shared/types";
import { PageHeader } from "../components/PageHeader";
import { TextInput } from "../components/TextInput";
import { TextArea } from "../components/TextArea";
import { Button } from "../components/Button";
import { PostChecklist } from "../components/PostChecklist";
import {
    appendLine,
    buildChecklist,
    withCoverage,
    type ChecklistItem
} from "../lib/postChecklist";

interface Props {
    draft: Draft;
    data: OnboardingData;
    onSave: (draft: Draft) => void;
    onBack: (draft: Draft) => void;
    onFinish: (draft: Draft) => void;
}

export function EditorPage({
    draft,
    data,
    onSave,
    onBack,
    onFinish
}: Props) {
    const [title, setTitle] =
        useState(draft.title);

    const [body, setBody] =
        useState(draft.body);

    // One editor for both paths: a chosen draft arrives filled in, "Draft my
    // own post" arrives empty, and nothing else about the page differs.
    const [items] = useState(() => buildChecklist(data));

    const checklist = withCoverage(items, body);

    const [saved, setSaved] = useState(false);

    const markChanged = () => setSaved(false);

    // Back and Finish commit the current text too, so leaving the editor
    // never silently discards what the user typed. `coveredTopics` is left
    // as the model wrote it: rewriting it from the checklist would change
    // the draft card just by opening and leaving the editor.
    const current = (): Draft => ({
        ...draft,
        title,
        body
    });

    // Picking adds the item's line; the tick follows from the text.
    const pickItem = (picked: ChecklistItem) => {
        setBody((currentBody) => appendLine(currentBody, picked.line));
        markChanged();
    };

    const hasContent = Boolean(body.trim());

    return (
        <>
            <PageHeader
                title="Your update"
                description="Write or edit your update, then continue when it's ready to post."
            />

            <div className="cb-editor">
                <div className="cb-editor__layout">
                    <div className="cb-editor__main">
                        <TextInput
                            label="Title"
                            value={title}
                            onChange={(value) => {
                                setTitle(value);
                                markChanged();
                            }}
                        />

                        <TextArea
                            label="Post detail"
                            value={body}
                            onChange={(value) => {
                                setBody(value);
                                markChanged();
                            }}
                            rows={14}
                        />

                        <div className="cb-editor__save">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    onSave(current());
                                    setSaved(true);
                                }}
                            >
                                Save draft
                            </Button>

                            {saved && (
                                <span
                                    className="cb-editor__saved"
                                    role="status"
                                >
                                    Saved
                                </span>
                            )}
                        </div>
                    </div>

                    <PostChecklist
                        items={checklist}
                        onPick={pickItem}
                    />
                </div>

                <div className="cb-editor__nav">
                    <Button
                        variant="secondary"
                        onClick={() => onBack(current())}
                    >
                        ← Back
                    </Button>

                    {!hasContent && (
                        <span
                            id="cb-editor-hint"
                            className="cb-editor__hint"
                        >
                            Add some detail to continue.
                        </span>
                    )}

                    <Button
                        onClick={() => onFinish(current())}
                        disabled={!hasContent}
                        describedBy={
                            hasContent ? undefined : "cb-editor-hint"
                        }
                    >
                        Save and continue →
                    </Button>
                </div>
            </div>
        </>
    );
}

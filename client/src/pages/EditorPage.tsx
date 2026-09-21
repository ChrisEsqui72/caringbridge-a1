import { useState } from "react";
import type { Draft, OnboardingData } from "../../../shared/types";
import { PageHeader } from "../components/PageHeader";
import { TextInput } from "../components/TextInput";
import { TextArea } from "../components/TextArea";
import { Button } from "../components/Button";
import { PostChecklist } from "../components/PostChecklist";
import { createId } from "../lib/id";
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
    const [items, setItems] = useState(() =>
        buildChecklist(data, draft.customTopics)
    );

    const checklist = withCoverage(items, body);

    const [saved, setSaved] = useState(false);

    const markChanged = () => setSaved(false);

    // Back and Finish commit the current text too, so leaving the editor
    // never silently discards what the user typed. Covered topics are
    // carried back so the draft card reflects what was added here.
    const current = (): Draft => ({
        ...draft,
        title,
        body,
        coveredTopics: checklist
            .filter((item) => item.checked)
            .map((item) => item.label),
        customTopics: items
            .filter((item) => !item.evidence)
            .map(({ label, checked }) => ({ label, checked }))
    });

    const pickItem = (picked: ChecklistItem) => {
        const { line } = picked;

        // A suggestion counts as covered once its line is in the post; a
        // user-added topic has no line and is ticked by hand.
        if (line) {
            setBody((currentBody) => appendLine(currentBody, line));
        } else {
            setItems((all) =>
                all.map((item) =>
                    item.id === picked.id
                        ? { ...item, checked: true }
                        : item
                )
            );
        }

        markChanged();
    };

    const removeItem = (removed: ChecklistItem) => {
        setItems((all) =>
            all.filter((item) => item.id !== removed.id)
        );
        markChanged();
    };

    const addItem = (label: string) => {
        setItems((all) => [
            ...all,
            { id: createId(), label, checked: false }
        ]);
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
                        onRemove={removeItem}
                        onAdd={addItem}
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
                        <span className="cb-editor__hint">
                            Add some detail to continue.
                        </span>
                    )}

                    <Button
                        onClick={() => onFinish(current())}
                        disabled={!hasContent}
                    >
                        Save and continue →
                    </Button>
                </div>
            </div>
        </>
    );
}

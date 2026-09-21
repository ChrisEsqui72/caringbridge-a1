import { useState } from "react";
import type { Draft } from "../../../shared/types";
import { PageHeader } from "../components/PageHeader";
import { TextInput } from "../components/TextInput";
import { TextArea } from "../components/TextArea";
import { Button } from "../components/Button";

interface Props {
    draft: Draft;
    onSave: (draft: Draft) => void;
    onBack: (draft: Draft) => void;
    onFinish: (draft: Draft) => void;
}

export function EditorPage({
    draft,
    onSave,
    onBack,
    onFinish
}: Props) {
    const [title, setTitle] =
        useState(draft.title);

    const [body, setBody] =
        useState(draft.body);

    const [saved, setSaved] = useState(false);

    // Back and Finish commit the current text too, so leaving the editor
    // never silently discards what the user typed.
    const current = (): Draft => ({
        ...draft,
        title,
        body
    });

    return (
        <>
            <PageHeader
                title="Make it yours."
                description="Review and edit your update before you're finished."
            />

            <div className="cb-editor">
                <TextInput
                    label="Title"
                    value={title}
                    onChange={(value) => {
                        setTitle(value);
                        setSaved(false);
                    }}
                />

                <TextArea
                    label="Your update"
                    value={body}
                    onChange={(value) => {
                        setBody(value);
                        setSaved(false);
                    }}
                    rows={16}
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

                <div className="cb-editor__nav">
                    <Button
                        variant="secondary"
                        onClick={() => onBack(current())}
                    >
                        ← Back
                    </Button>

                    <Button onClick={() => onFinish(current())}>
                        Finish
                    </Button>
                </div>
            </div>
        </>
    );
}

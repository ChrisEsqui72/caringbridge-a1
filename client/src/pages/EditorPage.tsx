import { useState } from "react";
import type { Draft } from "../../../shared/types";
import { PageHeader } from "../components/PageHeader";
import { TextInput } from "../components/TextInput";
import { TextArea } from "../components/TextArea";
import { Button } from "../components/Button";

interface Props {
    draft: Draft;
    onSave: (draft: Draft) => void;
    onBack: () => void;
    onFinish: () => void;
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

    return (
        <>
            <PageHeader
                title="Make it yours."
                description="Review and edit your update before you're finished."
            />

            <div className="editor">
                <TextInput
                    label="Title"
                    value={title}
                    onChange={setTitle}
                />

                <TextArea
                    label="Your update"
                    value={body}
                    onChange={setBody}
                    rows={16}
                />

                <Button
                    onClick={() =>
                        onSave({
                            ...draft,
                            title,
                            body
                        })
                    }
                >
                    Save draft
                </Button>

                <div className="mt-8 flex items-center justify-between px-4">
                <Button
                    variant="secondary"
                    onClick={onBack}
                >
                    ← Back
                </Button>

                <Button onClick={onFinish}>
                    Finish
                </Button>
            </div>
            </div>
        </>
    );
}
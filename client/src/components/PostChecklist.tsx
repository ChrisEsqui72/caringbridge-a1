import { useState, type FormEvent } from "react";
import type { ChecklistItem } from "../lib/postChecklist";

interface Props {
    items: ChecklistItem[];
    onPick: (item: ChecklistItem) => void;
    onRemove: (item: ChecklistItem) => void;
    onAdd: (label: string) => void;
}

export function PostChecklist({
    items,
    onPick,
    onRemove,
    onAdd
}: Props) {
    const [adding, setAdding] = useState(false);
    const [newLabel, setNewLabel] = useState("");

    const coveredCount = items.filter((item) => item.checked).length;

    const submitNewItem = (event: FormEvent) => {
        event.preventDefault();

        if (newLabel.trim()) {
            onAdd(newLabel.trim());
        }

        setNewLabel("");
        setAdding(false);
    };

    return (
        <section
            className="cb-checklist"
            aria-labelledby="cb-checklist-title"
        >
            <div
                className="cb-progress__track cb-checklist__track"
                role="progressbar"
                aria-label="Topics covered"
                aria-valuenow={coveredCount}
                aria-valuemin={0}
                aria-valuemax={items.length}
            >
                <div
                    className="cb-progress__fill"
                    style={{
                        width: `${
                            items.length
                                ? (coveredCount / items.length) * 100
                                : 0
                        }%`
                    }}
                />
            </div>

            <p className="cb-checklist__count">
                {coveredCount} of {items.length} covered
            </p>

            <h2
                id="cb-checklist-title"
                className="cb-checklist__title"
            >
                Your post covers
            </h2>

            {items.length === 0 ? (
                <p className="cb-checklist__empty">
                    Nothing yet. Add a topic you want to be sure to
                    mention.
                </p>
            ) : (
                <ul className="cb-checklist__list">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="cb-checklist__item"
                        >
                            {item.checked ? (
                                <span className="cb-checklist__pick cb-checklist__pick--done">
                                    <span
                                        className="cb-checklist__box"
                                        aria-hidden="true"
                                    >
                                        ✓
                                    </span>
                                    <span className="cb-checklist__label">
                                        {item.label}
                                    </span>
                                    <span className="sr-only">
                                        (covered)
                                    </span>
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    className="cb-checklist__pick"
                                    onClick={() => onPick(item)}
                                    title={item.line}
                                >
                                    <span
                                        className="cb-checklist__box"
                                        aria-hidden="true"
                                    />
                                    <span className="cb-checklist__label">
                                        {item.label}
                                    </span>
                                    <span className="sr-only">
                                        {item.line
                                            ? "(add a line about this)"
                                            : "(mark as covered)"}
                                    </span>
                                </button>
                            )}

                            <button
                                type="button"
                                className="cb-checklist__remove"
                                onClick={() => onRemove(item)}
                                aria-label={`Remove "${item.label}"`}
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {adding ? (
                <form
                    className="cb-checklist__add-form"
                    onSubmit={submitNewItem}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            setNewLabel("");
                            setAdding(false);
                        }
                    }}
                >
                    <input
                        className="cb-field__control"
                        value={newLabel}
                        onChange={(event) =>
                            setNewLabel(event.target.value)
                        }
                        placeholder="e.g. Visiting hours"
                        aria-label="New topic"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="cb-btn cb-btn--secondary"
                    >
                        Add
                    </button>
                </form>
            ) : (
                <button
                    type="button"
                    className="cb-checklist__add"
                    onClick={() => setAdding(true)}
                >
                    + Add item
                </button>
            )}

            <p className="cb-checklist__hint">
                Click an unchecked item to add a line to this post.
            </p>
        </section>
    );
}

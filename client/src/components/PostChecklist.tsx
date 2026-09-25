import type { ChecklistItem } from "../lib/postChecklist";

interface Props {
    items: ChecklistItem[];
    onPick: (item: ChecklistItem) => void;
}

export function PostChecklist({
    items,
    onPick
}: Props) {
    const coveredCount = items.filter((item) => item.checked).length;

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
                    No suggestions for this post yet.
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
                                        (add a line about this)
                                    </span>
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <p className="cb-checklist__hint">
                Click an unchecked item to add a line to this post.
            </p>
        </section>
    );
}
